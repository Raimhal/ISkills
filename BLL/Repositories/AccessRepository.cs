using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using BLL.Interfaces;
using Domain.Interfaces;
using System.Threading;
using Microsoft.AspNetCore.Http;

namespace BLL.Services
{

    public class AccessRepository : IAccessRepository
    {
        private readonly IUserDbContext _userContext;
        private readonly ICourseDbContext _courseContext;
        private readonly ICommentDbContext _commentContext;
        private readonly IVideoDbContext _videoContext;
        private readonly IChapterDbContext _chapterContext;
        private readonly string AdminRoleName = "Admin";

        public AccessRepository(IUserDbContext userContext, ICourseDbContext courseContext,
            ICommentDbContext commentContext, IVideoDbContext videoContext, IChapterDbContext chapterContext) 
            => (_userContext, _courseContext, _commentContext, _videoContext, _chapterContext) 
            = (userContext, courseContext, commentContext, videoContext, chapterContext);

        public async Task<bool> HasAccessToUser(Guid userId, Guid id, CancellationToken cancellationToken)
            => await HasAccessToEntity(userId, _userContext.Users,
                x => x.Id == id, cancellationToken);

        public async Task<bool> HasAccessToCourse(Guid userId, Guid id, CancellationToken cancellationToken)
            => await HasAccessToEntity(userId, _courseContext.Courses,
                x => x.CreatorId == userId && x.Id == id, cancellationToken);

        public async Task<bool> HasAccessToComment(Guid userId, Guid id, CancellationToken cancellationToken)
            => await HasAccessToEntity(userId, _commentContext.Comments,
                x => x.CreatorId == userId && x.Id == id, cancellationToken);

        public async Task<bool> HasAccessToChapter(Guid userId, Guid id, CancellationToken cancellationToken)
            => await HasAccessToEntity(userId, _chapterContext.Chapters, 
                x => x.Course.CreatorId == userId && x.Id == id, cancellationToken);

        public async Task<bool> HasAccessToVideo(Guid userId, Guid id, CancellationToken cancellationToken)
            => await HasAccessToEntity(userId, _videoContext.Videos,
                x => x.Chapter.Course.CreatorId == userId && x.Id == id, cancellationToken);

        public async Task<bool> HasAccessToCreateComment(Guid userId, Guid id, CancellationToken cancellationToken)
            => await HasAccessToEntity(userId, _courseContext.Courses,
                x => (x.CreatorId == userId || x.Students.Any(x => x.Id == userId)) && x.Id == id, cancellationToken);

        private async Task<bool> IsAdmin(Guid id, CancellationToken cancellationToken)
            => await _userContext.Users
            .AnyAsync(u => u.Id == id
            && u.Roles.Any(r => r.Name == AdminRoleName), cancellationToken);

        private async Task<bool> HasAccessToEntity<T>(Guid userId, DbSet<T> context,
            Expression<Func<T, bool>> expression, CancellationToken cancellationToken)
            where T : class
            => await IsAdmin(userId, cancellationToken) || await context.AnyAsync(expression, cancellationToken);

    }
}
