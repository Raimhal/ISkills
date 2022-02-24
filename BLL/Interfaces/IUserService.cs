using BLL.DtoModels;
using Domain.Models;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IUserService : IBaseService<User, RegisterUserModel, UserDto>
    {
        Task<Guid> GetIdFromEmail(string Email);
    }
}
