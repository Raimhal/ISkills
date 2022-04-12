using BLL.Interfaces;
using LazZiya.ImageResize;
using Microsoft.AspNetCore.Http;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class ImageService : IImageService
    {
        public readonly IAntivirusService _antivirusService;

        public ImageService(IAntivirusService antivirusService) =>
            _antivirusService = antivirusService;
        public async Task<MemoryStream> ResizeImage(IFormFile file, int width, int height)
        {
            await using var stream = new MemoryStream();
            //await _antivirusService.CheckFile(file);
            await file.OpenReadStream().CopyToAsync(stream);
            var image = Image.FromStream(stream, true, true);
            var newImage = ImageResize.Scale(image, width, height);
            newImage.Save(stream, image.RawFormat);
            stream.Seek(0, SeekOrigin.Begin);
            return stream;
        }
    }
}
