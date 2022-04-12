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
    class ThemeService : IThemeService
    {
        private readonly IThemeDbContext _themeDbContext;
        private readonly ICategoryDbContext _categoryDbContext;
        private readonly IMapper _mapper;

        public ThemeService(IThemeDbContext themeDbContext, ICategoryDbContext categoryContext, IMapper mapper) =>
            (_themeDbContext, _categoryDbContext, _mapper) = (themeDbContext, categoryContext, mapper);

        private readonly List<Expression<Func<Theme, dynamic>>> includes = new ()
        {
            x => x.Category,
            x => x.Courses
        };

        public async Task<PaginationList<ThemeDto>> GetList(int skip, int take, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken)
            => await _themeDbContext.Themes.GetListAsync<Theme, ThemeDto>(
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()), 
                sortOption, 
                reverse, 
                cancellationToken);

        public async Task<List<ThemeDto>> GetListAll(string query, string sortOption,
            bool reverse, CancellationToken cancellationToken)
            => await _themeDbContext.Themes.GetListAllAsync<Theme, ThemeDto>(
                _mapper, 
                c => c.Title.Contains(query.ToLower().Trim()), 
                sortOption,
                reverse, 
                cancellationToken);
        

        public async Task<Theme> GetByIdAsync(int id, CancellationToken cancellationToken)
            => await _themeDbContext.Themes.GetAsync(
                _mapper,
                x => x.Id == id,
                includes, 
                cancellationToken);


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
            theme.Category = category;

            _themeDbContext.Themes.Update(theme);
            await _themeDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(int id, CancellationToken cancellationToken)
        {
            await _themeDbContext.Themes.DeleteByAsync(_mapper, u => u.Id == id, cancellationToken);
            await _themeDbContext.SaveChangesAsync(cancellationToken);
        }

    }
}
