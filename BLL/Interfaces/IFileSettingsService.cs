using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using Domain.Models;

namespace BLL.Interfaces
{
    public interface IFileSettingsService 
    {
        Task<List<AllowedFileType>> GetAllowedFileTypes();
        Task<int> AddFileType(AllowedFileTypeDto fileTypeDto, CancellationToken cancellationToken);
        Task DeleteFileType(int id, CancellationToken cancellationToken);
    }
}
