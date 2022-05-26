using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;

namespace BLL.Interfaces
{
    public interface IAccountRepository
    {
        Task<AuthenticateResponse> Authenticate(AuthenticateRequest model, string ip, CancellationToken cancellationToken);
        Task<AuthenticateResponse> RefreshToken(string token, string ip, CancellationToken cancellationToken);
        Task<bool> RevokeToken(string token, string ip, CancellationToken cancellationToken);
    }
}
