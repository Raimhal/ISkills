using Azure.Storage.Blobs;
using BLL.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    class BlobStorage : IBlobStorage
    {
        private readonly string _blobStorageImageContainerName = "iskills-images";
        private readonly string _blobStorageVideoContainerName = "iskills-videos";
        private readonly string _blobStorageTextContainerName = "iskills-texts";
        private readonly string _blobStorageConnectionString = "DefaultEndpointsProtocol=https;AccountName=raimhalazurestorage;AccountKey=LhJDtgIui/4gPlkqvvCWnL3KfGEvZr71KoYWiIHh8INlnY9I6qcODff6zgy7YZCyR+d4mLYmJgll8U9RQ6DvkQ==;EndpointSuffix=core.windows.net";

        public async Task<string> AddToStorage(IFormFile file)
        {
            var containerClient = GetBlobContainer(file.ContentType);
            var blob = containerClient.GetBlobClient(file.FileName);

            using (var stream = new MemoryStream())
            {
                await file.OpenReadStream().CopyToAsync(stream);
                stream.Position = 0;
                await blob.UploadAsync(stream);
            }
            return blob.Uri.AbsoluteUri;
        }

        private BlobContainerClient GetBlobContainer(string storageType)
        {
            return new BlobContainerClient(
                _blobStorageConnectionString,
                storageType.Contains("image")
                ? _blobStorageImageContainerName
                : _blobStorageVideoContainerName);
        }
    }
}
