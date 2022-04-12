using BLL.DtoModels;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IVideoService : IBaseService<Guid, Video, CreateVideoDto, VideoDto>, IParentService<Guid, VideoDto>
    {
        Task PatchAsync(Guid id, UpdateVideoDto model, CancellationToken cancellationToken);
    }
}
