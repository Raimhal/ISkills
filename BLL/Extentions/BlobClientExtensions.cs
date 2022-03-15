using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

namespace BLL.Extentions
{
    public static class BlobClientExtensions
    {
        public static async Task UploadBlobAsync(this BlobClient blobClient, IFormFile file, bool _override = false)
        {
            await using var stream = file.OpenReadStream();
            stream.Seek(0, SeekOrigin.Begin);
            await blobClient.UploadAsync(stream, _override);
        }
    }
}
