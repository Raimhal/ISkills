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
    class CategoryService : ICategoryService
    {
        private readonly ICategoryDbContext _categoryDbContext;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryDbContext categoryDbContext, IMapper mapper) =>
            (_categoryDbContext, _mapper) = (categoryDbContext, mapper);

        private readonly List<Expression<Func<Category, dynamic>>> includes = new () 
        {
            x => x.Themes
        };

        public async Task<List<CategoryDto>> GetList(int skip, int take, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken)
            => await EntityService.GetListAsync<Category, CategoryDto>(
                _categoryDbContext.Categories,
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse,
                cancellationToken);

        public async Task<List<CategoryDto>> GetListAll(string query, string sortOption,
            bool reverse, CancellationToken cancellationToken)
            => await EntityService.GetListAllAsync<Category, CategoryDto>(
                _categoryDbContext.Categories,
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse,
                cancellationToken);

        public async Task<Category> GetByIdAsync(int id, CancellationToken cancellationToken) 
            => await EntityService.GetAsync(
                _categoryDbContext.Categories,
                _mapper,
                x => x.Id == id,
                includes,
                cancellationToken);

        public async Task<int> CreateAsync(CreateCategoryDto model, CancellationToken cancellationToken)
        {
            if (await _categoryDbContext.Categories.AnyAsync(c => c.Title == model.Title, cancellationToken))
                throw new AlreadyExistsException(nameof(Category), nameof(model.Title), model.Title);

            var category = _mapper.Map<Category>(model);

            await _categoryDbContext.Categories.AddAsync(category, cancellationToken);
            await _categoryDbContext.SaveChangesAsync(cancellationToken);

            return category.Id;
        }

        public async Task UpdateAsync(int id, CreateCategoryDto model, CancellationToken cancellationToken)
        {
            if (await _categoryDbContext.Categories.AnyAsync(c => c.Title == model.Title, cancellationToken))
                throw new AlreadyExistsException(nameof(Category), nameof(model.Title), model.Title);

            var category = await EntityService.GetAsync(_categoryDbContext.Categories,
                _mapper, c => c.Id == id, new() { }, cancellationToken);

            category = _mapper.Map<Category>(model);

            _categoryDbContext.Categories.Update(category);
            await _categoryDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(int id, CancellationToken cancellationToken)
        {
            await EntityService.DeleteByAsync(_categoryDbContext.Categories,
                _mapper, c => c.Id == id, cancellationToken);
            await _categoryDbContext.SaveChangesAsync(cancellationToken);
        }


    }
}
