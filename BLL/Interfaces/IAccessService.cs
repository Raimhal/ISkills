using System;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IAccessService
    {
        Task<bool> HasAccessToCourse(Guid userId, Guid id);
        Task<bool> HasAccessToComment(Guid userId, Guid id);
        Task<bool> HasAccessToUser(Guid userId, Guid id);
    }
}
