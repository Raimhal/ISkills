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
using BLL.DtoModels;

namespace BLL.Services
{
    public static class EntityExtensions
    {

        public static async Task<T> GetAsync<T>(this DbSet<T> context, IMapper _mapper, Expression<Func<T, bool>> expression,
            List<Expression<Func<T, dynamic>>> includes , CancellationToken cancellationToken = default)
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

        public static async Task<PaginationList<TDto>> GetListAsync<T, TDto>(this IQueryable<T> context, IMapper _mapper,
            int skip, int take, Expression<Func<T, bool>> expression, string sortOption, bool reverse,
            List<Expression<Func<T, dynamic>>> includes, CancellationToken cancellationToken = default) 
            where T : class where TDto : class
            => new()
            {
                TotalCount = await includes
                .Aggregate(
                    context.AsQueryable<T>(),
                    (current, include) => current.Include(include)
                )
                .Where(expression)
                .AsNoTracking()
                .CountAsync(cancellationToken),

                List = _mapper.Map<List<TDto>>(await context
                .Where(expression)
                .OrderBy(sortOption, reverse)
                .Skip(skip)
                .Take(take)
                .ProjectTo<TDto>(_mapper.ConfigurationProvider)
                .AsNoTracking()
                .ToListAsync(cancellationToken))
            };

        public static async Task<List<TDto>> GetListAllAsync<T, TDto>(this IQueryable<T> context, IMapper _mapper,
            Expression<Func<T, bool>> expression, string sortOption, bool reverse,
             List<Expression<Func<T, dynamic>>> includes, CancellationToken cancellationToken = default)
            where T : class where TDto : class 
            => _mapper.Map<List<TDto>>(await includes
                .Aggregate(
                    context.AsQueryable<T>(),
                    (current, include) => current.Include(include)
                )
                .OrderBy(sortOption, reverse)
                .ProjectTo<TDto>(_mapper.ConfigurationProvider)
                .AsNoTracking()
                .ToListAsync(cancellationToken));

        public static async Task DeleteByAsync<T>(this DbSet<T> context, IMapper _mapper,
            Expression<Func<T, bool>> expression, CancellationToken cancellationToken = default) where T : class
            => context.Remove(await GetAsync(context, _mapper, expression, new () { }, cancellationToken));

        public static async Task<double> GetAvarage<T>(this DbSet<T> context, Expression<Func<T, bool>> sortExpression,
            Expression<Func<T, double>> avarageExpression, CancellationToken cancellationToken = default) where T : class
            => await context.Where(sortExpression).AverageAsync(avarageExpression, cancellationToken);
    }
}
