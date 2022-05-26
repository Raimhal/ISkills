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
    class CategoryRepository : ICategoryRepository
    {
        private readonly ICategoryDbContext _categoryDbContext;
        private readonly IMapper _mapper;

        public CategoryRepository(ICategoryDbContext categoryDbContext, IMapper mapper) =>
            (_categoryDbContext, _mapper) = (categoryDbContext, mapper);

        private readonly List<Expression<Func<Category, dynamic>>> includes = new () 
        {

        };

        public async Task<PaginationList<CategoryDto>> GetList(int skip, int take, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken, params object[] dynamics)
            => await _categoryDbContext.Categories.GetListAsync<Category, CategoryDto>(
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse,
                new () { },
                cancellationToken);

        public async Task<List<CategoryDto>> GetListAll(string query, string sortOption,
            bool reverse, CancellationToken cancellationToken, params object[] dynamics)
        {
            var list = await _categoryDbContext.Categories.GetListAllAsync<Category, CategoryDto>(
                  _mapper,
                  c => c.Title.Contains(query.ToLower().Trim()),
                  sortOption,
                  reverse,
                  new() {  },
                  cancellationToken);
            return list;
        }

        public async Task<Category> GetByIdAsync(int id, CancellationToken cancellationToken) 
            => await _categoryDbContext.Categories.GetAsync(
                _mapper,
                x => x.Id == id,
                includes,
                cancellationToken);

        public async Task<int> CreateAsync(CreateCategoryDto model, CancellationToken cancellationToken)
        {
            if (await _categoryDbContext.Categories.AnyAsync(c => c.Title == model.Title, cancellationToken))
                throw new AlreadyExistsException(nameof(Category), nameof(model.Title), model.Title);

            var category = _mapper.Map<Category>(model);
            category.Themes = new List<Theme>();

            await _categoryDbContext.Categories.AddAsync(category, cancellationToken);
            await _categoryDbContext.SaveChangesAsync(cancellationToken);

            return category.Id;
        }

        public async Task UpdateAsync(int id, CreateCategoryDto model, CancellationToken cancellationToken)
        {
            var category = await _categoryDbContext.Categories
                .GetAsync(_mapper, c => c.Id == id, new() { }, cancellationToken);

            if (await _categoryDbContext.Categories.AnyAsync(c => c.Title == model.Title, cancellationToken) && category.Title != model.Title)
                throw new AlreadyExistsException(nameof(Category), nameof(model.Title), model.Title);

            category.Title = model.Title;

            _categoryDbContext.Categories.Update(category);
            await _categoryDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(int id, CancellationToken cancellationToken)
        {
            await _categoryDbContext.Categories.DeleteByAsync(_mapper, c => c.Id == id, cancellationToken);
            await _categoryDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
