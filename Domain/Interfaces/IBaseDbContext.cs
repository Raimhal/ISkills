using System.Threading;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IBaseDbContext
    {
        Task<int> SaveChangesAsync(CancellationToken cancelllationToken);
    }
}
