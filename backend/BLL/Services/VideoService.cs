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
        private readonly IFileService _fileService;
        public readonly IAntivirusService _antivirusService;
        public readonly ICloudinaryService _cloudinaryService;
        private readonly IMapper _mapper;

        public VideoService(IVideoDbContext videoDbContext, IChapterDbContext chapterDbContext,
            IFileService fileService, IAntivirusService antivirusService, IMapper mapper, ICloudinaryService cloudinaryService)
            => (_videoDbContext, _chapterDbContext, _fileService, _antivirusService, _mapper, _cloudinaryService)
            = (videoDbContext, chapterDbContext, fileService, antivirusService, mapper, cloudinaryService);

        private readonly List<Expression<Func<Video, dynamic>>> includes = new ()
        {
            x => x.Chapter
        };

        public async Task<PaginationList<VideoDto>> GetList(int skip, int take, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken)
            => await _videoDbContext.Videos.GetListAsync<Video, VideoDto>(
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse,
                new() { },
                cancellationToken);

        public async Task<List<VideoDto>> GetListAll(string query, string sortOption,
            bool reverse, CancellationToken cancellationToken)
            => await _videoDbContext.Videos.GetListAllAsync<Video, VideoDto>(
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse,
                new() { },
                cancellationToken);

        public async Task<PaginationList<VideoDto>> GetParentItems(Guid chapterId, int skip, int take,
            string query, string sortOption, bool reverse, CancellationToken cancellationToken)
           => await _videoDbContext.Videos.GetListAsync<Video, VideoDto>(
               _mapper,
               skip,
               take,
               c => c.Title.Contains(query.ToLower().Trim()) && c.ChapterId == chapterId,
               sortOption,
               reverse,
               new() { },
               cancellationToken);

        public async Task<List<VideoDto>> GetParentItemsAll(Guid chapterId, string query, string sortOption,
            bool reverse, CancellationToken cancellationToken)
            => await _videoDbContext.Videos.GetListAllAsync<Video, VideoDto>(
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()) && c.ChapterId == chapterId,
                sortOption,
                reverse,
                new() { },
                cancellationToken);

        public async Task<Video> GetByIdAsync(Guid id, CancellationToken cancellationToken)
            => await _videoDbContext.Videos.GetAsync(
                _mapper,
                x => x.Id == id,
                includes, 
                cancellationToken);
        

        public async Task<Guid> CreateAsync(CreateVideoDto model, CancellationToken cancellationToken)
        {
            var chapter = await _chapterDbContext.Chapters.GetAsync(_mapper,
                c => c.Id == model.ChapterId, new () { c => c.Videos }, cancellationToken);

            if (!await _fileService.IsValidFile(model.File))
                throw new FormatException("Too large file");

            var video = _mapper.Map<Video>(model);

            video.Id = Guid.NewGuid();

            // add antivirus
            // await _antivirusService.CheckFile(model.File); 
            video.Url = await _cloudinaryService.UploadVideoAsync(model.File, video.Id.ToString());

            await _videoDbContext.Videos.AddAsync(video, cancellationToken);
            await _videoDbContext.SaveChangesAsync(cancellationToken);

            return video.Id;
        }

        public async Task UpdateAsync(Guid id, CreateVideoDto model, CancellationToken cancellationToken)
        {
            var video = await _videoDbContext.Videos.GetAsync(_mapper,
                v => v.Id == id, new () { }, cancellationToken);

            if (!await _fileService.IsValidFile(model.File))
                throw new FormatException("Too large file");

            if (await _chapterDbContext.Chapters.AnyAsync(x => x.Id == model.ChapterId, cancellationToken))
                video.ChapterId = model.ChapterId;

            video.Title = model.Title;

            //await _antivirusService.CheckFile(model.File);
            video.Url = await _cloudinaryService
                .UploadVideoAsync(model.File, video.Id.ToString());


            _videoDbContext.Videos.Update(video);
            await _videoDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task PatchAsync(Guid id, UpdateVideoDto model, CancellationToken cancellationToken)
        {
            var video = await _videoDbContext.Videos.GetAsync(_mapper,
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
            var video = await _videoDbContext.Videos.GetAsync(
                _mapper, v => v.Id == id, new() { }, cancellationToken);

            await _cloudinaryService.DeleteAsync(video.Url);
            _videoDbContext.Videos.Remove(video);

            await _videoDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
