using System;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IAccessService
    {
        Task<bool> HasAccessToCourse(Guid userId, Guid courseId);
        Task<bool> HasAccessToUser(Guid userId, Guid id);
    }
}
