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
    class ThemeRepository : IThemeRepository
    {
        private readonly IThemeDbContext _themeDbContext;
        private readonly ICategoryDbContext _categoryDbContext;
        private readonly ICourseDbContext _courseDbContext;
        private readonly IMapper _mapper;
        private readonly int defaultThemeId = 1;

        public ThemeRepository(IThemeDbContext themeDbContext, ICategoryDbContext categoryContext,
            ICourseDbContext courseDbContext, IMapper mapper) =>
            (_themeDbContext, _categoryDbContext, _courseDbContext,_mapper) 
            = (themeDbContext, categoryContext, courseDbContext, mapper);

        private readonly List<Expression<Func<Theme, dynamic>>> includes = new ()
        {
            x => x.Category,
        };

        public async Task<Theme> GetByIdAsync(int id, CancellationToken cancellationToken)
            => await _themeDbContext.Themes.GetAsync(
                _mapper,
                x => x.Id == id,
                includes, 
                cancellationToken);

        public async Task<PaginationList<ThemeDto>> GetList(int skip, int take,
            string query, string sortOption, bool reverse, CancellationToken cancellationToken, params object[] dynamics)
        {
            int? categoryId = (int?)dynamics[0];
            return await _themeDbContext.Themes.GetListAsync<Theme, ThemeDto>(
                _mapper,
                skip,
                take,
                t => t.Title.ToLower().Contains(query.ToLower().Trim()) && (categoryId == null || t.CategoryId == categoryId),
                sortOption,
                reverse,
                new() { },
                cancellationToken);
        }

        public async Task<List<ThemeDto>> GetListAll(string query, string sortOption, bool reverse,
            CancellationToken cancellationToken, params object[] dynamics)
        {
            int? categoryId = (int?)dynamics[0];
            return await _themeDbContext.Themes.GetListAllAsync<Theme, ThemeDto>(
                _mapper,
                t => t.Title.ToLower().Contains(query.ToLower().Trim()) && (categoryId == null || t.CategoryId == categoryId),
                sortOption,
                reverse,
                new() { },
                cancellationToken);
        }


        public async Task<int> CreateAsync(CreateThemeDto model, CancellationToken cancellationToken)
        {
            if (await _themeDbContext.Themes.AnyAsync(c => c.Title == model.Title, cancellationToken))
                throw new AlreadyExistsException(nameof(Theme), nameof(model.Title), model.Title);

            var theme = _mapper.Map<Theme>(model);

            await _themeDbContext.Themes.AddAsync(theme, cancellationToken);
            await _themeDbContext.SaveChangesAsync(cancellationToken);

            return theme.Id;
        }

        public async Task UpdateAsync(int id, CreateThemeDto model, CancellationToken cancellationToken)
        {

            var theme = await _themeDbContext.Themes.GetAsync(
                _mapper, t => t.Id == id, new() { }, cancellationToken);

            if (await _themeDbContext.Themes.AnyAsync(c => c.Title == model.Title, cancellationToken) && theme.Title != model.Title)
                throw new AlreadyExistsException(nameof(Theme), nameof(model.Title), model.Title);

            var category = await _categoryDbContext.Categories.GetAsync(
                _mapper, c => c.Id == model.CategoryId, new() { }, cancellationToken);

            theme.Title = model.Title;

            if (theme.CategoryId != model.CategoryId && theme.Id == defaultThemeId)
                throw new ConflictException("You can't change the default theme category!");

            theme.Category = category;

            _themeDbContext.Themes.Update(theme);
            await _themeDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(int id, CancellationToken cancellationToken)
        {
            if (id == defaultThemeId)
                throw new ConflictException("You can't delete default theme!");

            var theme = await _themeDbContext.Themes.GetAsync(_mapper, u => u.Id == id, new() { x => x.Courses},cancellationToken);

            foreach (var course in theme.Courses)
                course.ThemeId = defaultThemeId;

            await _courseDbContext.SaveChangesAsync(cancellationToken);

            _themeDbContext.Themes.Remove(theme);

            await _themeDbContext.SaveChangesAsync(cancellationToken);
        }

    }
}
