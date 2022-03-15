using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using Domain.Models;
using Google.Apis.Drive.v3;

namespace BLL.Interfaces
{
    public interface IFileService : IBaseService<int, AllowedFileType, CreateAllowedFileTypeDto, AllowedFileTypeDto>
    {
        Task<bool> IsValidFile(IFormFile file);
    }
}
