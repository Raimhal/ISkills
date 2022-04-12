using BLL.Extentions;
using System;
using System.Linq.Expressions;

namespace BLL.Validation.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string entity, string key, object value)
            : base (
                @$"{entity} " +
                $"with " +
                $"{key.ToLower()} " +
                $"({value}) " +
                $"not found."
            )     
        { }
    }
}
