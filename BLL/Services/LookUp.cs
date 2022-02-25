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
    public static class LookUp
    {

        public static async Task<T> GetAsync<T>(DbSet<T> context, IMapper _mapper,
            Expression<Func<T, bool>> expression, List<Expression<Func<T, dynamic>>> includes)
            where T : class
        {
            var entity = await includes
                .Aggregate(
                    context.AsQueryable<T>(),
                    (current, include) => current.Include(include)
                )
                .AsNoTracking()
                .FirstOrDefaultAsync(expression);

            if (entity == null)
            {
                var body = (BinaryExpression)expression.Body;
                var entityType = expression.Parameters[0].Type.Name;
                throw new NotFoundException(entityType, Expression.Lambda(body.Right).Compile().DynamicInvoke());
            }

            return _mapper.Map<T>(entity);
        }

        public static async Task<List<TDto>> GetListAsync<T, TDto>(IQueryable<T> context,
            IMapper _mapper, int skip, int take, Expression<Func<T, bool>> expression, 
            string sortOption, bool reverse) where T : class where TDto : class 
            => await context.Where(expression)
                .Skip(skip)
                .Take(take)
                .OrderBy<T>(sortOption, reverse)
                .ProjectTo<TDto>(_mapper.ConfigurationProvider)
                .AsNoTracking()
                .ToListAsync();

        public static async Task<List<TDto>> GetListAllAsync<T, TDto>(IQueryable<T> context,
            IMapper _mapper, Expression<Func<T, bool>> expression, string sortOption, bool reverse)
            where T : class where TDto : class 
            => await context.Where(expression)
                .OrderBy<T>(sortOption, reverse)
                .ProjectTo<TDto>(_mapper.ConfigurationProvider)
                .AsNoTracking()
                .ToListAsync();

        public static async Task DeleteByAsync<T>(DbSet<T> context, IMapper _mapper,
            Expression<Func<T, bool>> expression) where T : class
            => context.Remove(await GetAsync<T>(context, _mapper, expression, new List<Expression<Func<T, dynamic>>> { }));
        




    }
}
