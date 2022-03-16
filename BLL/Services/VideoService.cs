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
        private readonly IBlobService _blobService;
        private readonly IFileService _fileService;
        public readonly IAntivirusService _antivirusService;
        private readonly IMapper _mapper;

        public VideoService(IVideoDbContext videoDbContext, IChapterDbContext chapterDbContext,
            IBlobService blobService, IFileService fileService, IAntivirusService antivirusService, IMapper mapper)
            => (_videoDbContext, _chapterDbContext, _blobService, _fileService, _antivirusService, _mapper)
            = (videoDbContext, chapterDbContext, blobService, fileService, antivirusService, mapper);

        private readonly List<Expression<Func<Video, dynamic>>> includes = new ()
        {
            x => x.Chapter
        };

        public async Task<List<VideoDto>> GetList(int skip, int take, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken)
            => await EntityService.GetListAsync<Video, VideoDto>(
                _videoDbContext.Videos,
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse, 
                cancellationToken);

        public async Task<List<VideoDto>> GetListAll(string query, string sortOption,
            bool reverse, CancellationToken cancellationToken)
            => await EntityService.GetListAllAsync<Video, VideoDto>(
                _videoDbContext.Videos,
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse, 
                cancellationToken);

        public async Task<List<VideoDto>> GetParentItems(Guid chapterId, int skip, int take,
            string query, string sortOption, bool reverse, CancellationToken cancellationToken)
           => await EntityService.GetListAsync<Video, VideoDto>(
               _videoDbContext.Videos,
               _mapper,
               skip,
               take,
               c => c.Title.Contains(query.ToLower().Trim()) && c.ChapterId == chapterId,
               sortOption,
               reverse, 
               cancellationToken);

        public async Task<List<VideoDto>> GetParentItemsAll(Guid chapterId, string query, string sortOption,
            bool reverse, CancellationToken cancellationToken)
            => await EntityService.GetListAllAsync<Video, VideoDto>(
                _videoDbContext.Videos,
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()) && c.ChapterId == chapterId,
                sortOption,
                reverse, 
                cancellationToken);

        public async Task<Video> GetByIdAsync(Guid id, CancellationToken cancellationToken)
            => await EntityService.GetAsync(
                _videoDbContext.Videos,
                _mapper,
                x => x.Id == id,
                includes, 
                cancellationToken);
        

        public async Task<Guid> CreateAsync(CreateVideoDto model, CancellationToken cancellationToken)
        {
            var chapter = await EntityService.GetAsync(_chapterDbContext.Chapters, _mapper,
                c => c.Id == model.ChapterId, new () { c => c.Videos }, cancellationToken);

            if (!await _fileService.IsValidFile(model.File))
                throw new FormatException("Too large file");

            var video = _mapper.Map<Video>(model);

            video.Id = Guid.NewGuid();

            //await _antivirusService.CheckFile(model.File);
            video.Url = await _blobService.CreateBlob(model.File, video.Id.ToString());

            await _videoDbContext.Videos.AddAsync(video, cancellationToken);
            await _videoDbContext.SaveChangesAsync(cancellationToken);

            return video.Id;
        }

        public async Task UpdateAsync(Guid id, CreateVideoDto model, CancellationToken cancellationToken)
        {
            var video = await EntityService.GetAsync(_videoDbContext.Videos, _mapper,
                v => v.Id == id, new () { }, cancellationToken);

            if (!await _fileService.IsValidFile(model.File))
                throw new FormatException("Too large file");

            if (await _chapterDbContext.Chapters.AnyAsync(x => x.Id == model.ChapterId, cancellationToken))
                video.ChapterId = model.ChapterId;

            video.Title = model.Title;

            //await _antivirusService.CheckFile(model.File);
            await _blobService.UpdateBlob(model.File, video.Url);


            _videoDbContext.Videos.Update(video);
            await _videoDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task PatchAsync(Guid id, UpdateVideoDto model, CancellationToken cancellationToken)
        {
            var video = await EntityService.GetAsync(_videoDbContext.Videos, _mapper,
                v => v.Id == id, new() { }, cancellationToken);

            if (await _chapterDbContext.Chapters
                .AnyAsync(x => x.Id == model.ChapterId, cancellationToken))
                video.ChapterId = model.ChapterId;

            video.Title = model.Title;

            _videoDbContext.Videos.Update(video);
            await _videoDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            var video = await EntityService.GetAsync(_videoDbContext.Videos,
                _mapper, v => v.Id == id, new() { }, cancellationToken);

            await _blobService.DeleteBlob(video.Url);
            _videoDbContext.Videos.Remove(video);

            await _videoDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
