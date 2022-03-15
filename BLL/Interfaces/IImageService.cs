using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    interface IImageService
    {
        Task<MemoryStream> ResizeImage(IFormFile file, int width, int height);
    }
}
