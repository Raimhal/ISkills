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

        public CourseService(ICourseDbContext courseDbContext, IUserDbContext userContext, IThemeDbContext themeContext, IMapper mapper) =>
            (_courseDbContext, _userContext, _themeContext, _mapper) = (courseDbContext, userContext, themeContext, mapper);

        public async Task<List<CourseDto>> GetList(int skip, int take, string query, string sortOption, bool reverse)
        {
            Expression<Func<Course, bool>> expression = c => c.Title.Contains(query.ToLower().Trim());
            return await LookUp.GetListAsync<Course, CourseDto>(_courseDbContext.Courses, _mapper, skip, take, expression, sortOption, reverse);
        }

        public async Task<List<CourseDto>> GetListAll(string query, string sortOption, bool reverse)
        {
            Expression<Func<Course, bool>> expression = c => c.Title.Contains(query.ToLower().Trim());
            return await LookUp.GetListAllAsync<Course, CourseDto>(_courseDbContext.Courses, _mapper, expression, sortOption, reverse);
        }

        public async Task<Course> GetByIdAsync(Guid id)
        {
            Expression<Func<Course, bool>> expression = x => x.Id == id;
            return await LookUp.GetAsync(_courseDbContext.Courses, _mapper, expression, includes);
        }

        public async Task<Guid> CreateAsync(CreateCourseDto model, CancellationToken cancellationToken)
        {
            Expression<Func<User, bool>> expression = u => u.Id == model.CreatorId;
            var user = await _userContext.Users
                .FirstOrDefaultAsync(expression, cancellationToken);

            if (user == null)
                throw new NotFoundException(nameof(User), model.CreatorId);

            Expression<Func<Theme, bool>> themeExpression = t => t.Id == model.ThemeId;
            if (!await _themeContext.Themes.AnyAsync(t => t.Id == model.ThemeId, cancellationToken))
                throw new NotFoundException(nameof(Theme), model.ThemeId);

            var course = _mapper.Map<Course>(model);

            course.Id = Guid.NewGuid();
            course.DateCreated = DateTime.UtcNow;
            course.DateUpdated = DateTime.UtcNow;
            course.Users = new List<User> { user };
            course.Comments = new List<Comment>();
            course.Chapters = new List<Chapter>();

            await _courseDbContext.Courses.AddAsync(course, cancellationToken);
            await _courseDbContext.SaveChangesAsync(cancellationToken);

            return course.Id;
        }

        public async Task UpdateAsync(Guid id, CreateCourseDto model, CancellationToken cancellationToken)
        {
            Expression<Func<Course, bool>> expression = c => c.Id == id;
            var course = await _courseDbContext.Courses
                .FirstOrDefaultAsync(expression, cancellationToken);

            if (course == null)
                throw new NotFoundException(nameof(Course), id);

            course = _mapper.Map<Course>(model);
            course.DateUpdated = DateTime.UtcNow;

            _courseDbContext.Courses.Update(course);
            await _courseDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            if (id != Guid.Empty)
            {
                Expression<Func<Course, bool>> expression = c => c.Id == id;
                var course = await _courseDbContext.Courses
                    .FirstOrDefaultAsync(expression, cancellationToken);

                if (course == null)
                    throw new NotFoundException(nameof(Course), id);

                _courseDbContext.Courses.Remove(course);
                await _courseDbContext.SaveChangesAsync(cancellationToken);

            }
        }

        private List<Expression<Func<Course, dynamic>>> includes = new List<Expression<Func<Course, dynamic>>> {
                x => x.Users,
                x => x.Comments,
                x => x.Chapters,
                x => x.Theme
        };
    }
}
