using System;
using System.Linq.Expressions;

namespace BLL.Extentions
{
    public static class ExpressionExtensions
    {
        public static dynamic GetExpressionPropertyValue<T, TResult>(this Expression<Func<T, TResult>> expression)
            where T: class 
            where TResult: new()
            => Expression.Lambda(expression.GetExpressionBody().Right).Compile().DynamicInvoke();

        public static string GetExpressionPropertyName<T, TResult>(this Expression<Func<T, TResult>> expression)
            where T : class
            where TResult : new()
            => ((MemberExpression)expression.GetExpressionBody().Left).Member.Name;

        public static string GetExpressionEntityName<T, TResult>(this Expression<Func<T, TResult>> expression)
            where T : class
            where TResult : new()
            => expression.Parameters[0].Type.Name;

        private static BinaryExpression GetExpressionBody<T, TResult>(this Expression<Func<T, TResult>> expression)
            where T : class
            where TResult : new()
            => (BinaryExpression)expression.Body;
    }
}
