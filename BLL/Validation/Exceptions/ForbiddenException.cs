using BLL.Extentions;
using System;
using System.Linq.Expressions;

namespace BLL.Validation.Exceptions
{
    public class AlreadyExistsException : Exception
    {
        public AlreadyExistsException(string entity, object key, object value)
            : base (
                $"{entity} " +
                $"with this " +
                $"{key} " +
                $"({value}) " +
                $"already exists."
            )     
        { }
    }
}
