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

        public async Task<List<ChapterDto>> GetList(int skip, int take, string query, string sortOption, bool reverse)
            => await LookUp.GetListAsync<Chapter, ChapterDto>(
                _chapterDbContext.Chapters,
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()), 
                sortOption,
                reverse);

        public async Task<List<ChapterDto>> GetListAll(string query, string sortOption, bool reverse)
            => await LookUp.GetListAllAsync<Chapter, ChapterDto>(
                _chapterDbContext.Chapters,
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()),
                sortOption,
                reverse);

        public async Task<List<ChapterDto>> GetCourseComments(Guid courseId, int skip, int take, string query, string sortOption, bool reverse)
            => await LookUp.GetListAsync<Chapter, ChapterDto>(
                _chapterDbContext.Chapters,
                _mapper,
                skip,
                take,
                c => c.Title.Contains(query.ToLower().Trim()) && c.CourseId == courseId,
                sortOption,
                reverse);

        public async Task<List<ChapterDto>> GetCourseCommentsAll(Guid courseId, string query, string sortOption, bool reverse)
            => await LookUp.GetListAllAsync<Chapter, ChapterDto>(
                _chapterDbContext.Chapters,
                _mapper,
                c => c.Title.Contains(query.ToLower().Trim()) && c.CourseId == courseId,
                sortOption,
                reverse);

        public async Task<Chapter> GetByIdAsync(Guid id)
            => await LookUp.GetAsync(
                _chapterDbContext.Chapters,
                _mapper,
                x => x.Id == id,
                includes);
        

        public async Task<Guid> CreateAsync(CreateChapterDto model, CancellationToken cancellationToken)
        {
            var course = await LookUp.GetAsync<Course>(_courseDbContext.Courses, _mapper,
                c => c.Id == model.CourseId, new() { c => c.Chapters });
            //course.Chapters.Add(chapter);

            var chapter = _mapper.Map<Chapter>(model);


            await _chapterDbContext.Chapters.AddAsync(chapter, cancellationToken);
            await _chapterDbContext.SaveChangesAsync(cancellationToken);

            return chapter.Id;
        }

        public async Task UpdateAsync(Guid id, CreateChapterDto model, CancellationToken cancellationToken)
        {
            var chapter = await LookUp.GetAsync<Chapter>(_chapterDbContext.Chapters, _mapper,
                v => v.Id == id, new() { });

            chapter = _mapper.Map<Chapter>(model);

            _chapterDbContext.Chapters.Update(chapter);
            await _courseDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            await LookUp.DeleteByAsync<Chapter>(_chapterDbContext.Chapters, _mapper, c => c.Id == id);
            await _chapterDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
