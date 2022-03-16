using BLL.DtoModels;
using Domain.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IUserService : IBaseService<Guid, User, RegisterUserModel, UserDto>
    {
        Task<Guid> GetIdFromEmail(string Email, CancellationToken cancellationToken);
        Task UpdateUserImageAsync(Guid id, IFormFile file, int width, int height, CancellationToken cancellationToken);
    }
}
