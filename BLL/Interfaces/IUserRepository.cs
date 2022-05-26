using BLL.DtoModels;
using Domain.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IUserRepository : IBaseRepository<Guid, User, RegisterUserModel, UserDto>
    {
        Task<Guid> GetIdFromEmail(string Email, CancellationToken cancellationToken);
        Task<UserDetailsDto> GetShortInfoByIdAsync(Guid id, CancellationToken cancellationToken);
        Task PartlyUpdateAsync(Guid id, UpdateUserModel model, CancellationToken cancellationToken);
        Task<string> UpdateImageAsync(Guid id, IFormFile file, int width, int height, CancellationToken cancellationToken);
    }
}
