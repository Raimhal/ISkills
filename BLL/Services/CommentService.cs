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
using System.ComponentModel.DataAnnotations;

namespace BLL.Services
{
    class CommentService : ICommentService
    {
        private readonly ICourseDbContext _courseDbContext;
        private readonly ICommentDbContext _commentDbContext;
        private readonly IUserDbContext _userDbContext;
        private readonly IMapper _mapper;

        public CommentService(ICourseDbContext courseDbContext, ICommentDbContext commentDbContext,
            IUserDbContext userDbContext, IMapper mapper) 
            => (_courseDbContext, _commentDbContext, _userDbContext, _mapper) 
            = (courseDbContext, commentDbContext, userDbContext, mapper);

        private readonly List<Expression<Func<Comment, dynamic>>> includes = new ()
        {
            x => x.Course,
            x => x.Creator
        };

        public async Task<List<CommentDto>> GetList(int skip, int take, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken)
            => await EntityService.GetListAsync<Comment, CommentDto>(
                _commentDbContext.Comments,
                _mapper,
                skip,
                take,
                c => c.Content.Contains(query.ToLower().Trim()),
                sortOption,
                reverse,
                cancellationToken);

        public async Task<List<CommentDto>> GetListAll(string query, string sortOption,
            bool reverse, CancellationToken cancellationToken)
            => await EntityService.GetListAllAsync<Comment, CommentDto>(
                _commentDbContext.Comments,
                _mapper,
                c => c.Content.Contains(query.ToLower().Trim()),
                sortOption,
                reverse,
                cancellationToken);

        public async Task<List<CommentDto>> GetParentItems(Guid courseId, int skip, int take,
            string query, string sortOption, bool reverse, CancellationToken cancellationToken)
            => await EntityService.GetListAsync<Comment, CommentDto>(
                _commentDbContext.Comments,
                _mapper,
                skip,
                take,
                c => c.Content.Contains(query.ToLower().Trim()) && c.CourseId == courseId,
                sortOption,
                reverse,
                cancellationToken);

        public async Task<List<CommentDto>> GetParentItemsAll(Guid courseId, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken)
            => await EntityService.GetListAllAsync<Comment, CommentDto>(
                _commentDbContext.Comments,
                _mapper,
                c => c.Content.Contains(query.ToLower().Trim()) && c.CourseId == courseId,
                sortOption,
                reverse,
                cancellationToken);

        public async Task<Comment> GetByIdAsync(Guid id, CancellationToken cancellationToken)
            => await EntityService.GetAsync(
                _commentDbContext.Comments,
                _mapper,
                x => x.Id == id,
                includes,
                cancellationToken);

        public async Task<Guid> CreateAsync(CreateCommentDto model, CancellationToken cancellationToken)
        {
            Expression<Func<User, bool>> expression = u => u.Id == model.CreatorId;
            if (!await _userDbContext.Users.AnyAsync(expression, cancellationToken))
                throw new NotFoundException(nameof(User), nameof(model.CreatorId), model.CreatorId);

            Expression<Func<Course, bool>> courseExpression = t => t.Id == model.CourseId;
            if (!await _courseDbContext.Courses.AnyAsync(courseExpression, cancellationToken))
                throw new NotFoundException(nameof(Course), nameof(model.CourseId), model.CreatorId);

            var comment = _mapper.Map<Comment>(model);
            comment.Date = DateTime.UtcNow;
            comment.DateUpdated = DateTime.UtcNow;

            await _commentDbContext.Comments.AddAsync(comment, cancellationToken);
            await _commentDbContext.SaveChangesAsync(cancellationToken);

            return comment.Id;
        }

        public async Task UpdateAsync(Guid id, CreateCommentDto model, CancellationToken cancellationToken)
        {
            var comment = await EntityService.GetAsync(_commentDbContext.Comments,
                _mapper, c => c.Id == id, new () { }, cancellationToken);

            if (string.IsNullOrEmpty(model.Content))
                throw new ValidationException();

            comment.Content = model.Content;
            comment.DateUpdated = DateTime.UtcNow;

            _commentDbContext.Comments.Update(comment);
            await _commentDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            await EntityService.DeleteByAsync(_commentDbContext.Comments, _mapper, c => c.Id == id, cancellationToken);
            await _courseDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
