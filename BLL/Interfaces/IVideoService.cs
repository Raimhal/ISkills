using BLL.DtoModels;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IVideoService : IBaseService<Guid, Video, CreateVideoDto, VideoDto>
    {
        Task<List<VideoDto>> GetChapterVideos(Guid chapterId, int skip, int take, string query, string sortOption, bool reverse);
        Task<List<VideoDto>> GetChapterVideosAll(Guid chapterId, string query, string sortOption, bool reverse);
    }
}
