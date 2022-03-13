using BLL.DtoModels;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IChapterService : IBaseService<Guid, Chapter, CreateChapterDto, ChapterDto>
    {
        Task<List<ChapterDto>> GetCourseComments(Guid courseId, int skip, int take, string query, string sortOption, bool reverse);
        Task<List<ChapterDto>> GetCourseCommentsAll(Guid courseId, string query, string sortOption, bool reverse);
    }
}
