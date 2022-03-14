using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

namespace BLL.Extentions
{
    public static class BlobClientExtensions
    {
        public static async Task UploadBlobAsync(this BlobClient blobClient, IFormFile file)
        {
            using (var stream = new MemoryStream())
            {
                await file.OpenReadStream().CopyToAsync(stream);
                stream.Position = 0;
                await blobClient.UploadAsync(stream);
            }
        }
    }
}
