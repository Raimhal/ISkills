using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using Microsoft.AspNetCore.Http;

namespace BLL.Interfaces
{
    public interface ICloudinaryService
    {
        public Task<string> UploadFileAsync(IFormFile file, string fileName);
        public Task<string> UploadImageAsync(IFormFile image, string imageName, int width, int height);
        public Task<string> UploadVideoAsync(IFormFile video, string videoName);
        public Task DeleteAsync(string url);
    }
}
