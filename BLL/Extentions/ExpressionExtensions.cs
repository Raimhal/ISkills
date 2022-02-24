using System;
using System.Linq.Expressions;

namespace BLL.Extentions
{
    public static class ExpressionExtensions
    {
        public static dynamic GetExpressionPropertyValue(this Expression<Func<dynamic, dynamic>> expression)
            => Expression.Lambda(expression.GetExpressionBody().Right).Compile().DynamicInvoke();

        public static string GetExpressionPropertyName(this Expression<Func<dynamic, dynamic>> expression)
            => ((MemberExpression)expression.GetExpressionBody().Left).Member.Name;

        public static string GetExpressionEntityName(this Expression<Func<dynamic, dynamic>> expression)
            => expression.Parameters[0].Type.Name;

        private static BinaryExpression GetExpressionBody(this Expression<Func<dynamic, dynamic>> expression)
            => (BinaryExpression)expression.Body;
    }
}
