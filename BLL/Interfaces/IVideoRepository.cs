using BLL.DtoModels;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IVideoRepository : IRepository<Guid, Video, CreateVideoDto, VideoDto>
    {
        Task PatchAsync(Guid id, UpdateVideoDto model, CancellationToken cancellationToken);
        Task<Guid> CreateAsync(CreateVideoByUrlDto model, CancellationToken cancellationToken);
        Task UpdateAsync(Guid id, CreateVideoByUrlDto model, CancellationToken cancellationToken);
    }
}
