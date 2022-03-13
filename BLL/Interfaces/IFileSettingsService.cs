using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using Domain.Models;
using Google.Apis.Drive.v3;

namespace BLL.Interfaces
{
    public interface IFileSettingsService : IBaseService<int, AllowedFileType, CreateAllowedFileTypeDto, AllowedFileTypeDto>
    {
    }
}
