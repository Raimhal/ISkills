using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using BLL.Validation;
using BLL.Validation.Exceptions;
using Domain.Interfaces;
using Domain.Models;

namespace BLL.Services
{
    class VideoService : IVideoService
    {
        private readonly IVideoDbContext _videoDbContext;
        private readonly IChapterDbContext _chapterDbContext;
        private readonly IBlobStorage _blobStorage;
        private readonly IMapper _mapper;

        public VideoService(IVideoDbContext videoDbContext, IChapterDbContext chapterDbContext,
            IBlobStorage blobStorage, IMapper mapper)
            => (_videoDbContext, _chapterDbContext, _blobStorage,_mapper)
            = (videoDbContext, chapterDbContext, blobStorage, mapper);

        private readonly List<Expression<Func<Video, dynamic>>> includes = new ()
        {
            x => x.Chapter
        };

        public async Task<List<VideoDto>> GetList(int skip, int take, string query, string sortOption, bool reverse)
            => await LookUp.GetListAsync<Video, VideoDto>(
                _videoDbContext.Videos,
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse);

        public async Task<List<VideoDto>> GetListAll(string query, string sortOption, bool reverse)
            => await LookUp.GetListAllAsync<Video, VideoDto>(
                _videoDbContext.Videos,
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse);

        public async Task<List<VideoDto>> GetChapterVideos(Guid chapterId, int skip, int take, string query, string sortOption, bool reverse)
           => await LookUp.GetListAsync<Video, VideoDto>(
               _videoDbContext.Videos,
               _mapper,
               skip,
               take,
               c => c.Title.Contains(query.ToLower().Trim()) && c.ChapterId == chapterId,
               sortOption,
               reverse);

        public async Task<List<VideoDto>> GetChapterVideosAll(Guid chapterId, string query, string sortOption, bool reverse)
            => await LookUp.GetListAllAsync<Video, VideoDto>(
                _videoDbContext.Videos,
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()) && c.ChapterId == chapterId,
                sortOption,
                reverse);

        public async Task<Video> GetByIdAsync(Guid id)
            => await LookUp.GetAsync(
                _videoDbContext.Videos,
                _mapper,
                x => x.Id == id,
                includes);
        

        public async Task<Guid> CreateAsync(CreateVideoDto model, CancellationToken cancellationToken)
        {
            var chapter = await LookUp.GetAsync<Chapter>(_chapterDbContext.Chapters, _mapper,
                c => c.Id == model.ChapterId, new () { c => c.Videos });
            var video = _mapper.Map<Video>(model);
            video.Url = await _blobStorage.AddToStorage(model.File);

            //chapter.Videos.Add(video);

            await _videoDbContext.Videos.AddAsync(video, cancellationToken);
            await _videoDbContext.SaveChangesAsync(cancellationToken);

            return video.Id;
        }

        public async Task UpdateAsync(Guid id, CreateVideoDto model, CancellationToken cancellationToken)
        {
            var video = await LookUp.GetAsync<Video>(_videoDbContext.Videos, _mapper,
                v => v.Id == id, new () { });

            video = _mapper.Map<Video>(model);

            _videoDbContext.Videos.Update(video);
            await _videoDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            await LookUp.DeleteByAsync<Video>(_videoDbContext.Videos, _mapper, v => v.Id == id);
            await _videoDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
