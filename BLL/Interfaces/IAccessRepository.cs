using System;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IAccessRepository
    {
        Task<bool> HasAccessToCourse(Guid userId, Guid id, CancellationToken cancellationToken);
        Task<bool> HasAccessToComment(Guid userId, Guid id, CancellationToken cancellationToken);
        Task<bool> HasAccessToUser(Guid userId, Guid id, CancellationToken cancellationToken);
        Task<bool> HasAccessToChapter(Guid userId, Guid id, CancellationToken cancellationToken);
        Task<bool> HasAccessToVideo(Guid userId, Guid id, CancellationToken cancellationToken);
        Task<bool> HasAccessToCreateComment(Guid userId, Guid id, CancellationToken cancellationToken);
    }
}
