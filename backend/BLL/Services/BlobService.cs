using AutoMapper;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
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

        public BlobService(BlobServiceClient blobServiceClient) =>
            (_blobServiceClient) = (blobServiceClient);

        public async Task<string> CreateBlob(IFormFile file, string name)
        {
            var containerClient = GetBlobContainer(file.ContentType);
            var fileName = $"{name}.{file.FileName.Split('.')[^1]}";
            var blobClient = containerClient.GetBlobClient(fileName);
            blobClient.WithVersion("2021-04-10");
            await blobClient.UploadBlobAsync(file, new BlobHttpHeaders { ContentType = file.ContentType,  });
            return blobClient.Uri.AbsoluteUri;
        }

        public async Task<string> CreateBlob(Stream stream, string contentType, string name, string extension)
        {
            var containerClient = GetBlobContainer(contentType);
            var fileName = $"{name}.{extension}";
            var blobClient = containerClient.GetBlobClient(fileName);
            blobClient.WithVersion("2021-04-10");
            await blobClient.UploadAsync(stream, new BlobUploadOptions { HttpHeaders = new BlobHttpHeaders { ContentType = contentType } });
            return blobClient.Uri.AbsoluteUri;
        }

        public async Task UpdateBlob(IFormFile file, string url)
        {
            var blobClient = GetBlobClientFromUrl(url);
            blobClient.WithVersion("2021-04-10");
            await blobClient.UploadBlobAsync(file, new BlobHttpHeaders { ContentType = file.ContentType });
        }

        public async Task UpdateBlob(Stream stream, string url, string contentType)
        {
            var blobClient = GetBlobClientFromUrl(url);
            blobClient.WithVersion("2021-04-10");
            await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = contentType });
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


    }
}
