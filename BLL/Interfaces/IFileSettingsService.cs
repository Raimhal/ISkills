using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using Domain.Models;

namespace BLL.Interfaces
{
    public interface IFileSettingsService : IBaseService<int, AllowedFileType, CreateAllowedFileTypeDto, AllowedFileTypeDto>
    {
    }
}
