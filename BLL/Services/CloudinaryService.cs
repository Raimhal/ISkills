﻿using AutoMapper;
using BLL.DtoModels;
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
        private readonly IMapper _mapper;

        public CloudinaryService(IConfiguration configuration, IFileRepository fileService, IMapper mapper)
        {
            _cloudinary = new Cloudinary(Environment.GetEnvironmentVariable("CLOUDINARY_URL"));
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<PaginationList<CloudinarySearchResourceDto>> GetFilesLinks(string searchExpression, int skip, int take)
        {
            var result = await _cloudinary.Search()
                .Expression(searchExpression)
                .SortBy("public_id", "desc")
                .MaxResults(skip + take)
                .ExecuteAsync();

            var resourses = _mapper.Map<List<CloudinarySearchResourceDto>>(result.Resources?.Skip(skip));
            var totalCount = result.TotalCount;

            return new PaginationList<CloudinarySearchResourceDto>
            {
                TotalCount = totalCount,
                List = resourses
            };
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
            await _cloudinary.DestroyAsync(CreateDeletionParams(url));
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

        private DeletionParams CreateDeletionParams(string url)
        {
            ResourceType resourceType;
            if (!url.Contains("/files/"))
                url = url[..url.LastIndexOf(".")];

            var publicId = string.Join("/", url.Split("/")[^2..]);

            if (url.Contains("/images/"))
                resourceType = ResourceType.Image;
            else if (url.Contains("/videos/"))
                resourceType = ResourceType.Video;
            else
                resourceType = ResourceType.Raw;

            return new DeletionParams(publicId) { ResourceType = resourceType };
        }
    }
}
