using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IBlobService
    {
        Task<string> CreateBlob(IFormFile file, string name);
        Task<string> CreateBlob(Stream stream, string contentType, string name, string extension);
        Task UpdateBlob(IFormFile stream, string url);
        Task UpdateBlob(Stream stream, string url);
        Task DeleteBlob(string url);
    }
}
