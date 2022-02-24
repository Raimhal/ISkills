using System;
using System.Linq;
using System.Linq.Expressions;

namespace BLL.Extentions
{
    public static class LinqExtensions
    {
        private static Expression<Func<T, object>> ToLambda<T>(string propertyName)
        {
            var parameter = Expression.Parameter(typeof(T));
            var property = Expression.Property(parameter, propertyName);
            var propAsObject = Expression.Convert(property, typeof(object));

            return Expression.Lambda<Func<T, object>>(propAsObject, parameter);
        }

        public static IQueryable<T> OrderBy<T>(this IQueryable<T> source,
            string propertyName, bool reverse)
            => reverse
                ? source.OrderByDescending(ToLambda<T>(propertyName))
                : source.OrderBy(ToLambda<T>(propertyName));
        
    }
}
