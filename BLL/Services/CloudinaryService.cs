using BLL.Interfaces;
using BLL.Validation.Exceptions;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;
        private readonly IFileRepository _fileService;

        public CloudinaryService(IConfiguration configuration, IFileRepository fileService)
        {
            _cloudinary = new Cloudinary(Environment.GetEnvironmentVariable("CLOUDINARY_URL"));
            _fileService = fileService;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string fileName)
        {
            var uploadParams = await CreateUploadParams<RawUploadParams>(file, $"{nameof(file)}s/{fileName}");
            return await UploadAsync(uploadParams);
        }


        public async Task<string> UploadImageAsync(IFormFile image, string imageName, int width, int height)
        {
            var uploadParams = await CreateUploadParams<ImageUploadParams>(image, $"{nameof(image)}s/{imageName}");
            uploadParams.Transformation = new Transformation()
                .Height(height).Width(width).Crop("scale");
            return await UploadAsync(uploadParams);
        }

        public async Task<string> UploadVideoAsync(IFormFile video, string videoName)
        {
            var uploadParams = await CreateUploadParams<VideoUploadParams>(video, $"{nameof(video)}s/{videoName}");
            return await UploadAsync(uploadParams);
        }

        public async Task DeleteAsync(string url)
        {
            if (string.IsNullOrEmpty(url))
                return;
            var publicId = string.Join("/", url.Split("/")[^2..]);
            var deletionParams = new DeletionParams(publicId);
            await _cloudinary.DestroyAsync(deletionParams);
        }

        private async Task<string> UploadAsync<T>(T uploadParams)
             where T : RawUploadParams
        {
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            return uploadResult.Url.ToString();
        }

        private async Task<T> CreateUploadParams<T>(IFormFile file, string name)
            where T : RawUploadParams
        {
            if (!await _fileService.IsValidFile(file))
                throw new ConflictException("File is too large");

            var stream = file.OpenReadStream();
            var uploadParams = (T)Activator.CreateInstance(typeof(T));
            uploadParams.File = new FileDescription(name, stream);
            uploadParams.PublicId = name;
            uploadParams.Overwrite = true;
            return uploadParams;
        }
    }
}
