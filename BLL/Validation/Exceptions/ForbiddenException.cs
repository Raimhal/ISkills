using BLL.Extentions;
using System;
using System.Linq.Expressions;

namespace BLL.Validation.Exceptions
{
    public class AlreadyExistsException : Exception
    {
        public AlreadyExistsException(string entity, object key)
            : base (
                $"{entity} " +
                $"with this " +
                $"parameter " +
                $"({key}) " +
                $"already exists."
            )     
        { }
    }
}
