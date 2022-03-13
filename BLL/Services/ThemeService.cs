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
        private readonly IMapper _mapper;

        public ThemeService(IThemeDbContext themeDbContext, IMapper mapper) =>
            (_themeDbContext, _mapper) = (themeDbContext, mapper);

        private readonly List<Expression<Func<Theme, dynamic>>> includes = new ()
        {
            x => x.Category
        };

        public async Task<List<ThemeDto>> GetList(int skip, int take, string query, string sortOption, bool reverse)
            => await LookUp.GetListAsync<Theme, ThemeDto>(
                _themeDbContext.Themes,
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()), 
                sortOption, 
                reverse);

        public async Task<List<ThemeDto>> GetListAll(string query, string sortOption, bool reverse)
            => await LookUp.GetListAllAsync<Theme, ThemeDto>(
                _themeDbContext.Themes, 
                _mapper, 
                c => c.Title.Contains(query.ToLower().Trim()), 
                sortOption,
                reverse);
        

        public async Task<Theme> GetByIdAsync(int id)
            => await LookUp.GetAsync(
                _themeDbContext.Themes,
                _mapper,
                x => x.Id == id,
                includes);
        

        public async Task<int> CreateAsync(CreateThemeDto model, CancellationToken cancellationToken)
        {
            if (await _themeDbContext.Themes.AnyAsync(c => c.Title == model.Title, cancellationToken))
                throw new AlreadyExistsException(nameof(Theme), model.Title);

            var theme = _mapper.Map<Theme>(model);
            theme.Courses = new List<Course>();

            await _themeDbContext.Themes.AddAsync(theme, cancellationToken);
            await _themeDbContext.SaveChangesAsync(cancellationToken);

            return theme.Id;
        }

        public async Task UpdateAsync(int id, CreateThemeDto model, CancellationToken cancellationToken)
        {

            if (await _themeDbContext.Themes.AnyAsync(c => c.Title == model.Title, cancellationToken))
                throw new AlreadyExistsException(nameof(Theme), model.Title);

            var theme = await LookUp.GetAsync<Theme>(_themeDbContext.Themes,
                _mapper, t => t.Id == id, new() { });

            theme = _mapper.Map<Theme>(model);

            _themeDbContext.Themes.Update(theme);
            await _themeDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(int id, CancellationToken cancellationToken)
        {
            await LookUp.DeleteByAsync<Theme>(_themeDbContext.Themes, _mapper, u => u.Id == id);
            await _themeDbContext.SaveChangesAsync(cancellationToken);
        }

    }
}
