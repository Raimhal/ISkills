using BLL.Extentions;
using System;
using System.Linq.Expressions;

namespace BLL.Validation.Exceptions
{
    public class AlreadyExistsException : Exception
    {
        public AlreadyExistsException(string entity, string key, object value)
            : base (
                $"{entity} " +
                $"with " +
                $"{key.ToLower()} " +
                $"({value}) " +
                $"already exists."
            )     
        { }
    }
}
