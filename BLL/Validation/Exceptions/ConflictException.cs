using BLL.Extentions;
using System;
using System.Linq.Expressions;

namespace BLL.Validation.Exceptions
{
    public class ConflictException : Exception
    {
        public ConflictException(string message) : base($"{message}") { }
    }
}
