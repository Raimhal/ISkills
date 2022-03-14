using AutoMapper;
using Azure.Storage.Blobs;
using BLL.Extentions;
using BLL.Interfaces;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class BlobService : IBlobService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _blobStorageImageContainerName = "iskills-images";
        private readonly string _blobStorageVideoContainerName = "iskills-videos";
        private readonly string _blobStorageTextContainerName = "iskills-texts";


        private readonly IAllowedFileTypeDbContext _allowedFileTypesContext;
        private readonly IMapper _mapper;

        public BlobService(BlobServiceClient blobServiceClient, 
            IAllowedFileTypeDbContext fileTypeContext, IMapper mapper) 
            => (_blobServiceClient, _allowedFileTypesContext, _mapper)
            = (blobServiceClient, fileTypeContext, mapper);

        public async Task<string> CreateBlob(IFormFile file, string name)
        {
            if (!await IsValidFile(file))
                throw new FormatException("Too large file");
            var containerClient = GetBlobContainer(file.ContentType);
            var fileName = $"{name}.{file.FileName.Split('.')[^1]}";
            var blobClient = containerClient.GetBlobClient(fileName);

            await blobClient.UploadBlobAsync(file);
            return blobClient.Uri.AbsoluteUri;
        }

        public async Task UpdateBlob(IFormFile file, string url)
        {
            if (!await IsValidFile(file))
                throw new FormatException("Too large file");
            var blobClient = GetBlobClientFromUrl(url);
            await blobClient.DeleteIfExistsAsync();
            await blobClient.UploadBlobAsync(file);
        }

        

        public async Task DeleteBlob(string url) =>
            await GetBlobClientFromUrl(url).DeleteIfExistsAsync();


        private BlobContainerClient GetBlobContainer(string storageType)
        {
            string containerName;
            if (storageType.Contains("image"))
                containerName = _blobStorageImageContainerName;
            else if (storageType.Contains("video"))
                containerName = _blobStorageVideoContainerName;
            else
                containerName = _blobStorageTextContainerName;

            return _blobServiceClient.GetBlobContainerClient(containerName);
        }

        private BlobClient GetBlobClientFromUrl(string url)
        {
            var info = url.Split("/");
            var containerClient = _blobServiceClient.GetBlobContainerClient(info[^2]);
            return containerClient.GetBlobClient(info[^1]);
        }

        private async Task<bool> IsValidFile(IFormFile file)
        {
            if (file?.Length > 0)
            {
                var extension = Path.GetExtension(file.FileName).Replace(".", "");
                var type = await LookUp.GetAsync<AllowedFileType>(_allowedFileTypesContext.AllowedFileTypes,
                    _mapper, t => t.FileType == extension, new() { });
                return (file.Length / Math.Pow(10, 6)) <= type.FileSize;
            }
            return false;
        }
    }
}
