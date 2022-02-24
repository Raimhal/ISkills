using BLL.Extentions;
using System;
using System.Linq.Expressions;

namespace BLL.Validation.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string entity, object key)
            : base (
                $"{entity} " +
                $"with this " +
                $"parameter " +
                $"({key}) " +
                $"not found."
            )     
        { }
    }
}
