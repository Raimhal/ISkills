using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using BLL.Validation.Exceptions;
using BLL.Extentions;
using System.Threading;

namespace BLL.Services
{
    public static class EntityService
    {

        public static async Task<T> GetAsync<T>(DbSet<T> context, IMapper _mapper, Expression<Func<T, bool>> expression,
            List<Expression<Func<T, dynamic>>> includes, CancellationToken cancellationToken = default)
            where T : class
        {
            var entity = await includes
                .Aggregate(
                    context.AsQueryable<T>(),
                    (current, include) => current.Include(include)
                )
                .FirstOrDefaultAsync(expression, cancellationToken);

            if (entity == null)
            {
                var entityType = expression.GetExpressionEntityName();
                var key = expression.GetExpressionPropertyName();
                var value = expression.GetExpressionPropertyValue();
                throw new NotFoundException(entityType, key, value);
            }
            return _mapper.Map<T>(entity);
        }

        public static async Task<List<TDto>> GetListAsync<T, TDto>(IQueryable<T> context, IMapper _mapper,
            int skip, int take, Expression<Func<T, bool>> expression, string sortOption, bool reverse,
            CancellationToken cancellationToken) where T : class where TDto : class 
            => await context.Where(expression)
                .Skip(skip)
                .Take(take)
                .OrderBy(sortOption, reverse)
                .ProjectTo<TDto>(_mapper.ConfigurationProvider)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

        public static async Task<List<TDto>> GetListAllAsync<T, TDto>(IQueryable<T> context, IMapper _mapper,
            Expression<Func<T, bool>> expression, string sortOption, bool reverse,
            CancellationToken cancellationToken) where T : class where TDto : class 
            => await context.Where(expression)
                .OrderBy(sortOption, reverse)
                .ProjectTo<TDto>(_mapper.ConfigurationProvider)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

        public static async Task DeleteByAsync<T>(DbSet<T> context, IMapper _mapper,
            Expression<Func<T, bool>> expression, CancellationToken cancellationToken) where T : class
            => context.Remove(await GetAsync(context, _mapper, expression, new () { }, cancellationToken));
    }
}
