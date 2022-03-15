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

namespace BLL.Services
{
    class CourseService : ICourseService
    {
        private readonly ICourseDbContext _courseDbContext;
        private readonly IUserDbContext _userContext;
        private readonly IThemeDbContext _themeContext;
        private readonly IMapper _mapper;

        public CourseService(ICourseDbContext courseDbContext, IUserDbContext userContext,
            IThemeDbContext themeContext, IMapper mapper) 
            => (_courseDbContext, _userContext, _themeContext, _mapper) 
            = (courseDbContext, userContext, themeContext, mapper);

        private readonly List<Expression<Func<Course, dynamic>>> includes = new ()
        {
            x => x.Students,
            x => x.Comments,
            x => x.Chapters,
            x => x.Theme
        };

        public async Task<List<CourseDto>> GetList(int skip, int take, string query, string sortOption, bool reverse)
            => await LookUp.GetListAsync<Course, CourseDto>(
                _courseDbContext.Courses,
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse);

        public async Task<List<CourseDto>> GetListAll(string query, string sortOption, bool reverse)
            => await LookUp.GetListAllAsync<Course, CourseDto>(
                _courseDbContext.Courses,
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse);

        public async Task<Course> GetByIdAsync(Guid id)
            => await LookUp.GetAsync(
                _courseDbContext.Courses,
                _mapper,
                x => x.Id == id,
                includes);
        

        public async Task<Guid> CreateAsync(CreateCourseDto model, CancellationToken cancellationToken)
        {
            var user = await LookUp.GetAsync(_userContext.Users, _mapper,
                u => u.Id == model.CreatorId, new () { });

            var theme = await LookUp.GetAsync(_themeContext.Themes, _mapper,
                t => t.Id == model.ThemeId, new () { });

            var course = _mapper.Map<Course>(model);

            course.Id = Guid.NewGuid();
            course.DateCreated = DateTime.UtcNow;
            course.DateUpdated = DateTime.UtcNow;
            course.Students = new List<User>();
            course.Comments = new List<Comment>();
            course.Chapters = new List<Chapter>();

            await _courseDbContext.Courses.AddAsync(course, cancellationToken);
            await _courseDbContext.SaveChangesAsync(cancellationToken);

            return course.Id;
        }

        public async Task UpdateAsync(Guid id, CreateCourseDto model, CancellationToken cancellationToken)
        {
            var course = await LookUp.GetAsync(_courseDbContext.Courses, _mapper,
                v => v.Id == id, new () { x => x.Theme });

            var theme = await LookUp.GetAsync(_themeContext.Themes, _mapper,
                t => t.Id == model.ThemeId, new () { });

            course = _mapper.Map<Course>(model);
            course.Theme = theme;
            course.DateUpdated = DateTime.UtcNow;

            _courseDbContext.Courses.Update(course);
            await _courseDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            await LookUp.DeleteByAsync<Course>(_courseDbContext.Courses, _mapper, c => c.Id == id);
            await _courseDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task ToggleUserAssignment(Guid userId, Guid courseId, CancellationToken cancellationToken)
        {
            var user = await LookUp.GetAsync(_userContext.Users, _mapper, x => x.Id == userId, new() { x => x.Roles });
            var course = await LookUp.GetAsync(_courseDbContext.Courses, _mapper, x => x.Id == courseId, new() { x => x.Students });

            if (course.Students.Contains(user))
                course.Students.Remove(user);
            else
                course.Students.Add(user);

            _courseDbContext.Courses.Update(course);
            await _courseDbContext.SaveChangesAsync(cancellationToken);
        }

    }
}
