using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using BLL.Validation;
using BLL.Validation.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace BLL.Services
{
    class CourseRepository : ICourseService
    {
        private readonly ICourseDbContext _courseDbContext;
        private readonly IUserDbContext _userContext;
        private readonly IThemeDbContext _themeContext;
        private readonly IFileRepository _fileService;
        private readonly IMapper _mapper;
        private readonly ICloudinaryService _cloudinaryService;


        public CourseRepository(ICourseDbContext courseDbContext, IUserDbContext userContext,
            IThemeDbContext themeContext, IFileRepository fileService, ICloudinaryService cloudinaryService, IMapper mapper)
            => (_courseDbContext, _userContext, _themeContext, _fileService, _cloudinaryService, _mapper)
            = (courseDbContext, userContext, themeContext, fileService, cloudinaryService, mapper);

        public async Task<PaginationList<CourseDto>> GetList(int skip, int take, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken, params object[] dynamics)
        {
            int? themeId = (int?) dynamics[0];
            Guid? creatorId = (Guid?) dynamics[1];

            return await _courseDbContext.Courses.GetListAsync<Course, CourseDto>(
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim())
                && (themeId == null || c.ThemeId == themeId)
                && (creatorId == null || c.CreatorId == creatorId),
                sortOption,
                reverse,
                new() { },
                cancellationToken);
        }

        public async Task<List<CourseDto>> GetListAll(string query, string sortOption, bool reverse,
            CancellationToken cancellationToken, params object[] dynamics)
        {
            int? themeId = (int?)dynamics[0];
            Guid? creatorId = (Guid?)dynamics[1];

            return await _courseDbContext.Courses.GetListAllAsync<Course, CourseDto>(
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim())
                && (themeId == null || c.ThemeId == themeId)
                && (creatorId == null || c.CreatorId == creatorId),
                sortOption,
                reverse,
                new () { },
                cancellationToken);
        }

        public async Task<PaginationList<CourseDto>> GetParentItems(int skip, int take,
           string query, string sortOption, bool reverse, CancellationToken cancellationToken, params object[] dynamics)
        {
            int? themeId = (int?)dynamics[0];
            Guid? studentId = (Guid?)dynamics[1];

            return await _courseDbContext.Courses.GetListAsync<Course, CourseDto>(
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim())
                && (themeId == null || c.ThemeId == themeId)
                && (studentId == null || c.Students.Any(x => x.Id == studentId)),
                sortOption,
                reverse,
                new() { },
                cancellationToken);
        }
        
        public async Task<List<CourseDto>> GetParentItemsAll(string query, string sortOption,
            bool reverse, CancellationToken cancellationToken, params object[] dynamics)
        {
            int? themeId = (int?)dynamics[0];
            Guid? studentId = (Guid?)dynamics[1];

            return await _courseDbContext.Courses.GetListAllAsync<Course, CourseDto>(
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim())
                && (themeId == null || c.ThemeId == themeId)
                && (studentId == null || c.Students.Any(x => x.Id == studentId)),
                sortOption,
                reverse,
                new() { },
                cancellationToken);
        }

        public async Task<Course> GetByIdAsync(Guid id, CancellationToken cancellationToken)
            => await _courseDbContext.Courses.GetAsync(
                _mapper,
                x => x.Id == id,
                new() { x => x.Theme, x => x.Students},
                cancellationToken);

        public async Task<Guid> CreateAsync(CreateCourseDto model, CancellationToken cancellationToken)
        {
            var user = await _userContext.Users.GetAsync(_mapper,
                u => u.Id == model.CreatorId, new () { }, cancellationToken);

            var theme = await _themeContext.Themes.GetAsync(_mapper,
                t => t.Id == model.ThemeId, new() { }, cancellationToken);

            var course = _mapper.Map<Course>(model);

            course.Id = Guid.NewGuid();
            course.DateCreated = DateTime.UtcNow;
            course.DateUpdated = DateTime.UtcNow;
            course.Students = new List<User>();
            course.Comments = new List<Comment>();
            course.Chapters = new List<Chapter>();
            course.Rating = default;

            await _courseDbContext.Courses.AddAsync(course, cancellationToken);
            await _courseDbContext.SaveChangesAsync(cancellationToken);

            return course.Id;
        }

        public async Task UpdateAsync(Guid id, CreateCourseDto model, CancellationToken cancellationToken)
        {
            var course = await _courseDbContext.Courses.GetAsync(_mapper,
                v => v.Id == id, new () { x => x.Theme }, cancellationToken);

            var theme = await _themeContext.Themes.GetAsync(_mapper,
                t => t.Id == model.ThemeId, new () { }, cancellationToken);

            course.Title = model.Title;
            course.ShortInfo = model.ShortInfo;
            course.Requirements = model.Requirements;
            course.Description = model.Description;
            course.Language = model.Language;
            course.Price = model.Price;

            course.Theme = theme;
            course.DateUpdated = DateTime.UtcNow;

            _courseDbContext.Courses.Update(course);
            await _courseDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<string> UpdateImageAsync(Guid id, IFormFile file,
            int width, int height, CancellationToken cancellationToken)
        {
            var course = await _courseDbContext.Courses.GetAsync(_mapper,
                x => x.Id == id, new() { }, cancellationToken);

            if (!file.ContentType.Contains("image"))
                throw new ConflictException("Not supported image format");

            course.ImageUrl = await _cloudinaryService
                .UploadImageAsync(file, course.Id.ToString(), width, height);

            _courseDbContext.Courses.Update(course);
            await _userContext.SaveChangesAsync(cancellationToken);
            return course.ImageUrl;
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            var course = await _courseDbContext.Courses.GetAsync(_mapper,
                c => c.Id == id, new() { }, cancellationToken);

            await _cloudinaryService.DeleteAsync(course.ImageUrl);

            var creator = await _userContext.Users.GetAsync(
                _mapper, x => x.Id == course.CreatorId, new() { }, cancellationToken);

             _courseDbContext.Courses.Remove(course);
            await _courseDbContext.SaveChangesAsync(cancellationToken);

            creator.Rating = await _courseDbContext.Courses
                .GetAvarage(x => x.CreatorId == creator.Id && x.Rating != default, x => x.Rating);

            await _userContext.SaveChangesAsync(cancellationToken);

        }

        public async Task ToggleUserAssignment(Guid userId, Guid courseId, CancellationToken cancellationToken)
        {
            var user = await _userContext.Users.GetAsync(_mapper,
                x => x.Id == userId, new() { }, cancellationToken);

            var course = await _courseDbContext.Courses.GetAsync(
                _mapper, x => x.Id == courseId, new() { x => x.Students }, cancellationToken);

            if (course.CreatorId == user.Id)
                throw new ConflictException("Conflict! You are the creator of this course");

            if (course.Students.Contains(user))
                course.Students.Remove(user);
            else
                course.Students.Add(user);


            _courseDbContext.Courses.Update(course);
            await _courseDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
