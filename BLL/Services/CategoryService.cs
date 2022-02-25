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

        public async Task<List<CategoryDto>> GetList(int skip, int take, string query, string sortOption, bool reverse)
            => await LookUp.GetListAsync<Category, CategoryDto>(
                _categoryDbContext.Categories,
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse);

        public async Task<List<CategoryDto>> GetListAll(string query, string sortOption, bool reverse)
            => await LookUp.GetListAllAsync<Category, CategoryDto>(
                _categoryDbContext.Categories,
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse);

        public async Task<Category> GetByIdAsync(int id) 
            => await LookUp.GetAsync(
                _categoryDbContext.Categories,
                _mapper,
                x => x.Id == id,
                includes);
        

        public async Task<int> CreateAsync(CreateCategoryDto model, CancellationToken cancellationToken)
        {

            if (await _categoryDbContext.Categories.AnyAsync(c => c.Title == model.Title, cancellationToken))
                throw new AlreadyExistsException(nameof(Category), model.Title);

            var category = _mapper.Map<Category>(model);

            await _categoryDbContext.Categories.AddAsync(category, cancellationToken);
            await _categoryDbContext.SaveChangesAsync(cancellationToken);

            return category.Id;
        }

        public async Task UpdateAsync(int id, CreateCategoryDto model, CancellationToken cancellationToken)
        {
            Expression<Func<Category, bool>> expression = c => c.Id == id;
            var category = await _categoryDbContext.Categories
                .FirstOrDefaultAsync(expression, cancellationToken);

            if (category == null)
                throw new NotFoundException(nameof(Category), id);

            if (await _categoryDbContext.Categories.AnyAsync(c => c.Title == model.Title, cancellationToken))
                throw new AlreadyExistsException(nameof(Category), model.Title);

            category = _mapper.Map<Category>(model);

            _categoryDbContext.Categories.Update(category);
            await _categoryDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(int id, CancellationToken cancellationToken)
        {
            Expression<Func<Category, bool>> expression = c => c.Id == id;
            await LookUp.DeleteByAsync<Category>(_categoryDbContext.Categories, _mapper, expression);
            await _categoryDbContext.SaveChangesAsync(cancellationToken);
        }


    }
}
