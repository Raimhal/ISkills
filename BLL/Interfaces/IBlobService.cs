using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IBlobService
    {
        Task<string> CreateBlob(IFormFile file, string name);
        Task UpdateBlob(IFormFile file, string url);
        Task DeleteBlob(string url);
    }
}
