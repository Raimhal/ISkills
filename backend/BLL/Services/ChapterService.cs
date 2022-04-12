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
    class ChapterService : IChapterService
    {
        private readonly IChapterDbContext _chapterDbContext;
        private readonly ICourseDbContext _courseDbContext;
        private readonly IMapper _mapper;

        public ChapterService(ICourseDbContext courseDbContext, IChapterDbContext chapterContext, IMapper mapper) 
            => (_courseDbContext, _chapterDbContext, _mapper) 
            = (courseDbContext, chapterContext, mapper);

        private readonly List<Expression<Func<Chapter, dynamic>>> includes = new ()
        {
            x => x.Course
        };

        public async Task<PaginationList<ChapterDto>> GetList(int skip, int take, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken)
            => await _chapterDbContext.Chapters.GetListAsync<Chapter, ChapterDto>(
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()), 
                sortOption,
                reverse,
                cancellationToken);

        public async Task<List<ChapterDto>> GetListAll(string query, string sortOption,
            bool reverse, CancellationToken cancellationToken)
            => await _chapterDbContext.Chapters.GetListAllAsync<Chapter, ChapterDto>(
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse,
                cancellationToken);

        public async Task<PaginationList<ChapterDto>> GetParentItems(Guid courseId, int skip, int take,
            string query, string sortOption, bool reverse, CancellationToken cancellationToken)
            => await _chapterDbContext.Chapters.GetListAsync<Chapter, ChapterDto>(
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()) && c.CourseId == courseId,
                sortOption,
                reverse,
                cancellationToken);

        public async Task<List<ChapterDto>> GetParentItemsAll(Guid courseId, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken)
            => await _chapterDbContext.Chapters.GetListAllAsync<Chapter, ChapterDto>(
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()) && c.CourseId == courseId,
                sortOption,
                reverse,
                cancellationToken);

        public async Task<Chapter> GetByIdAsync(Guid id, CancellationToken cancellationToken)
            => await _chapterDbContext.Chapters.GetAsync(
                _mapper,
                x => x.Id == id,
                includes,
                cancellationToken);

        public async Task<Guid> CreateAsync(CreateChapterDto model, CancellationToken cancellationToken)
        {
            var course = await _courseDbContext.Courses.GetAsync(_mapper,
                c => c.Id == model.CourseId, new() { c => c.Chapters }, cancellationToken);

            var chapter = _mapper.Map<Chapter>(model);

            await _chapterDbContext.Chapters.AddAsync(chapter, cancellationToken);
            await _chapterDbContext.SaveChangesAsync(cancellationToken);

            return chapter.Id;
        }

        public async Task UpdateAsync(Guid id, CreateChapterDto model, CancellationToken cancellationToken)
        {
            var chapter = await _chapterDbContext.Chapters.GetAsync(_mapper,
                c => c.Id == id, new() { }, cancellationToken);

            var course = await _courseDbContext.Courses.GetAsync(_mapper,
                c => c.Id == model.CourseId, new() { }, cancellationToken);

            chapter.Title = model.Title;
            chapter.Description = model.Description;
            chapter.Course = course;

            _chapterDbContext.Chapters.Update(chapter);
            await _courseDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            await _chapterDbContext.Chapters.DeleteByAsync(_mapper, c => c.Id == id, cancellationToken);
            await _chapterDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
