using BLL.DtoModels;
using Domain.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IUserService : IBaseService<Guid, User, RegisterUserModel, UserDto>, IParentService<Guid, UserDto>
    {
        Task<Guid> GetIdFromEmail(string Email, CancellationToken cancellationToken);
        Task<UserDto> GetShortInfoByIdAsync(Guid id, CancellationToken cancellationToken);
        Task UpdateImageAsync(Guid id, IFormFile file, int width, int height, CancellationToken cancellationToken);
    }
}
