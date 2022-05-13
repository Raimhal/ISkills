using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IAntivirusService
    {
        Task CheckFile(IFormFile file);
    }
}
