using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IBlobStorage
    {
        Task<string> AddToStorage(IFormFile file);
    }
}
