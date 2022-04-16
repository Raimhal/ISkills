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

namespace BLL.Services
{
    class CourseService : ICourseService
    {
        private readonly ICourseDbContext _courseDbContext;
        private readonly IUserDbContext _userContext;
        private readonly IThemeDbContext _themeContext;
        private readonly IBlobService _blobService;
        private readonly IImageService _imageService;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public CourseService(ICourseDbContext courseDbContext, IUserDbContext userContext,
            IThemeDbContext themeContext, IBlobService blobService, IImageService imageService,
            IFileService fileService, IMapper mapper)
            => (_courseDbContext, _userContext, _themeContext, _blobService, _imageService, _fileService, _mapper)
            = (courseDbContext, userContext, themeContext, blobService, imageService, fileService, mapper);

        private readonly List<Expression<Func<Course, dynamic>>> includes = new()
        {
            x => x.Theme
        };

        public async Task<PaginationList<CourseDto>> GetList(int skip, int take, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken)
            => await _courseDbContext.Courses.GetListAsync<Course, CourseDto>(
                  _mapper,
                  skip,
                  take,
                  c => c.Title.Contains(query.ToLower().Trim()),
                  sortOption,
                  reverse,
                  new() { },
                  cancellationToken);

        public async Task<List<CourseDto>> GetListAll(string query, string sortOption,
            bool reverse, CancellationToken cancellationToken)
            => await _courseDbContext.Courses.GetListAllAsync<Course, CourseDto>(
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse,
                new() { },
                cancellationToken);

        public async Task<PaginationList<CourseDto>> GetParentItems(Guid userId, int skip, int take,
            string query, string sortOption, bool reverse, CancellationToken cancellationToken)
            => await _courseDbContext.Courses.GetListAsync<Course, CourseDto>(
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()) && c.CreatorId == userId,
                sortOption,
                reverse,
                new() { },
                cancellationToken);

        public async Task<List<CourseDto>> GetParentItemsAll(Guid userId, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken)
            => await _courseDbContext.Courses.GetListAllAsync<Course, CourseDto>(
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()) && c.CreatorId == userId,
                sortOption,
                reverse,
                new() { },
                cancellationToken);
        

        public async Task<PaginationList<CourseDto>> GetParentItems(int themeId, int skip, int take,
            string query, string sortOption, bool reverse, CancellationToken cancellationToken)
            => await _courseDbContext.Courses.GetListAsync<Course, CourseDto>(
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()) && c.ThemeId == themeId,
                sortOption,
                reverse,
                new() { },
                cancellationToken);

        public async Task<List<CourseDto>> GetParentItemsAll(int themeId, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken)
            => await _courseDbContext.Courses.GetListAllAsync<Course, CourseDto>(
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()) && c.ThemeId == themeId,
                sortOption,
                reverse,
                new() { },
                cancellationToken);

        public async Task<Course> GetByIdAsync(Guid id, CancellationToken cancellationToken)
            => await _courseDbContext.Courses.GetAsync(
                _mapper,
                x => x.Id == id,
                includes,
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

            user.Rating = await _userContext.Users
                .GetAvarage(x => x.Id == user.Id, x => x.Rating);

            await _userContext.SaveChangesAsync(cancellationToken);

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

        public async Task UpdateImageAsync(Guid id, IFormFile file,
            int width, int height, CancellationToken cancellationToken)
        {
            var course = await _courseDbContext.Courses.GetAsync(_mapper,
                x => x.Id == id, new() { }, cancellationToken);

            if (!file.ContentType.Contains("image"))
                throw new ConflictException("Not supported image format");

            if (!await _fileService.IsValidFile(file))
                throw new FormatException("Too large file");

            var imageStream = await _imageService.ResizeImage(file, width, height);
            await using var stream = new MemoryStream(imageStream.ToArray());

            if (string.IsNullOrEmpty(course.ImageUrl))
                course.ImageUrl = await _blobService.CreateBlob(stream,
                    file.ContentType, course.Id.ToString(), file.FileName.Split(".")[^1]);
            else
                await _blobService.UpdateBlob(stream, course.ImageUrl);

            _courseDbContext.Courses.Update(course);
            await _userContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            await _courseDbContext.Courses.DeleteByAsync<Course>(_mapper, c => c.Id == id, cancellationToken);
            await _courseDbContext.SaveChangesAsync(cancellationToken);
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
