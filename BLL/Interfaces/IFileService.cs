﻿using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using Domain.Models;


namespace BLL.Interfaces
{
    public interface IFileService : IBaseService<int, AllowedFileType, CreateAllowedFileTypeDto, AllowedFileTypeDto>
    {
        Task<bool> IsValidFile(IFormFile file);
    }
}
