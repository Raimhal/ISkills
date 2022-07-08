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
    class VideoRepository : IVideoRepository
    {
        private readonly IVideoDbContext _videoDbContext;
        private readonly IChapterDbContext _chapterDbContext;
        private readonly IFileRepository _fileRepository;
        public readonly IAntivirusService _antivirusService;
        public readonly ICloudinaryService _cloudinaryService;
        private readonly IMapper _mapper;

        public VideoRepository(IVideoDbContext videoDbContext, IChapterDbContext chapterDbContext,
            IFileRepository fileRepository, IAntivirusService antivirusService, IMapper mapper, ICloudinaryService cloudinaryService)
            => (_videoDbContext, _chapterDbContext, _fileRepository, _antivirusService, _mapper, _cloudinaryService)
            = (videoDbContext, chapterDbContext, fileRepository, antivirusService, mapper, cloudinaryService);

        private readonly List<Expression<Func<Video, dynamic>>> includes = new()
        {
            x => x.Chapter
        };


        public async Task<PaginationList<VideoDto>> GetList(int skip, int take,
            string query, string sortOption, bool reverse, CancellationToken cancellationToken, params object[] dynamics)
        {
            Guid? chapterId = (Guid?)dynamics[0];
            return await _videoDbContext.Videos.GetListAsync<Video, VideoDto>(
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()) && (chapterId == null || c.ChapterId == chapterId),
                sortOption,
                reverse,
                new() { },
                cancellationToken);
        }

        public async Task<List<VideoDto>> GetListAll(string query, string sortOption,
            bool reverse, CancellationToken cancellationToken, params object[] dynamics)
        {
            Guid? chapterId = (Guid?)dynamics[0];
            return await _videoDbContext.Videos.GetListAllAsync<Video, VideoDto>(
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()) && (chapterId == null || c.ChapterId == chapterId),
                sortOption,
                reverse,
                new() { },
                cancellationToken);
        }

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

            if (!model.File.ContentType.Contains("video"))
                throw new ConflictException("Not supported video file type");

            var video = _mapper.Map<Video>(model);

            video.Id = Guid.NewGuid();

            // add antivirus
            // await _antivirusService.CheckFile(model.File); 

            video.Url = await _cloudinaryService.UploadVideoAsync(model.File, video.Id.ToString());

            await _videoDbContext.Videos.AddAsync(video, cancellationToken);
            await _videoDbContext.SaveChangesAsync(cancellationToken);

            return video.Id;
        }

        public async Task<Guid> CreateAsync(CreateVideoByUrlDto model, CancellationToken cancellationToken)
        {
            var chapter = await _chapterDbContext.Chapters.GetAsync(_mapper,
                c => c.Id == model.ChapterId, new() { c => c.Videos }, cancellationToken);

            var video = _mapper.Map<Video>(model);

            video.Id = Guid.NewGuid();

            // add antivirus
            // await _antivirusService.CheckFile(model.File); 

            await _videoDbContext.Videos.AddAsync(video, cancellationToken);
            await _videoDbContext.SaveChangesAsync(cancellationToken);

            return video.Id;
        }

        public async Task UpdateAsync(Guid id, CreateVideoDto model, CancellationToken cancellationToken)
        {
            var video = await _videoDbContext.Videos.GetAsync(_mapper,
                v => v.Id == id, new () { }, cancellationToken);

            if (!await _fileRepository.IsValidFile(model.File))
                throw new ConflictException("File is too large");

            if (await _chapterDbContext.Chapters.AnyAsync(x => x.Id == model.ChapterId, cancellationToken))
                video.ChapterId = model.ChapterId;

            video.Title = model.Title;

            //await _antivirusService.CheckFile(model.File);
            video.Url = await _cloudinaryService
                .UploadVideoAsync(model.File, video.Id.ToString());


            _videoDbContext.Videos.Update(video);
            await _videoDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(Guid id, CreateVideoByUrlDto model, CancellationToken cancellationToken)
        {
            var video = await _videoDbContext.Videos.GetAsync(_mapper,
                v => v.Id == id, new() { }, cancellationToken);

            if (await _chapterDbContext.Chapters.AnyAsync(x => x.Id == model.ChapterId, cancellationToken))
                video.ChapterId = model.ChapterId;

            video.Title = model.Title;
            video.Url = model.Url;


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

            _videoDbContext.Videos.Remove(video);

            await _videoDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
