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
using System.Linq;

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
        };

        public async Task<PaginationList<CommentDto>> GetList(int skip, int take, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken)
            => await _commentDbContext.Comments.GetListAsync<Comment, CommentDto>(
                _mapper,
                skip,
                take,
                c => c.Content.Contains(query.ToLower().Trim()),
                sortOption,
                reverse,
                cancellationToken);

        public async Task<List<CommentDto>> GetListAll(string query, string sortOption,
            bool reverse, CancellationToken cancellationToken)
            => await _commentDbContext.Comments.GetListAllAsync<Comment, CommentDto>(
                _mapper,
                c => c.Content.Contains(query.ToLower().Trim()),
                sortOption,
                reverse,
                cancellationToken);

        public async Task<PaginationList<CommentDto>> GetParentItems(Guid courseId, int skip, int take,
            string query, string sortOption, bool reverse, CancellationToken cancellationToken)
            => await _commentDbContext.Comments.GetListAsync<Comment, CommentDto>(
                _mapper,
                skip,
                take,
                c => c.Content.Contains(query.ToLower().Trim()) && c.CourseId == courseId,
                sortOption,
                reverse,
                cancellationToken);

        public async Task<List<CommentDto>> GetParentItemsAll(Guid courseId, string query,
            string sortOption, bool reverse, CancellationToken cancellationToken)
            => await _commentDbContext.Comments.GetListAllAsync<Comment, CommentDto>(
                _mapper,
                c => c.Content.Contains(query.ToLower().Trim()) && c.CourseId == courseId,
                sortOption,
                reverse,
                cancellationToken);

        public async Task<Comment> GetByIdAsync(Guid id, CancellationToken cancellationToken)
            => await _commentDbContext.Comments.GetAsync(
                _mapper,
                x => x.Id == id,
                includes,
                cancellationToken);

        public async Task<Guid> CreateAsync(CreateCommentDto model, CancellationToken cancellationToken)
        {
            Expression<Func<User, bool>> userExpression = u => u.Id == model.CreatorId;
            var user = await _userDbContext.Users
               .GetAsync(_mapper, userExpression, new() { }, cancellationToken);

            Expression<Func<Course, bool>> courseExpression = c => c.Id == model.CourseId;
            var course = await _courseDbContext.Courses
                .GetAsync(_mapper, c => c.Id == model.CourseId, new() { }, cancellationToken);

            var comment = _mapper.Map<Comment>(model);
            comment.Date = DateTime.UtcNow;
            comment.DateUpdated = DateTime.UtcNow;

            await _commentDbContext.Comments.AddAsync(comment, cancellationToken);
            await _commentDbContext.SaveChangesAsync(cancellationToken);

            course.Rating = await _commentDbContext.Comments
                .GetAvarage(x => x.CourseId == course.Id && x.Rating != default, x => x.Rating);

            await _courseDbContext.SaveChangesAsync(cancellationToken);

            user.Rating = await _courseDbContext.Courses
                .GetAvarage(x => x.CreatorId == user.Id && x.Rating != default, x => x.Rating);

            await _userDbContext.SaveChangesAsync(cancellationToken);

            return comment.Id;
        }

        public async Task UpdateAsync(Guid id, CreateCommentDto model, CancellationToken cancellationToken)
        {
            var comment = await _commentDbContext.Comments.
                GetAsync(_mapper, c => c.Id == id, new () { }, cancellationToken);

            if (string.IsNullOrEmpty(model.Content))
                throw new ValidationException();

            var user = await _userDbContext.Users
               .GetAsync(_mapper, u => u.Id == model.CreatorId, new() { }, cancellationToken);

            var course = await _courseDbContext.Courses
                .GetAsync(_mapper, c => c.Id == model.CourseId, new() { }, cancellationToken);

            comment.Content = model.Content;
            comment.DateUpdated = DateTime.UtcNow;
            comment.CourseId = model.CourseId;
            comment.Rating = model.Rating;


            _commentDbContext.Comments.Update(comment);
            await _commentDbContext.SaveChangesAsync(cancellationToken);

            course.Rating = await _commentDbContext.Comments
                .GetAvarage(x => x.CourseId == course.Id && x.Rating != default, x => x.Rating);

            await _courseDbContext.SaveChangesAsync(cancellationToken);

            user.Rating = await _courseDbContext.Courses
                .GetAvarage(x => x.CreatorId == user.Id && x.Rating != default, x => x.Rating);

            await _userDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            var course = await _courseDbContext.Courses
                .GetAsync(_mapper, c => c.Comments.Any(c => c.Id == id), new() { }, cancellationToken);

            await _commentDbContext.Comments.DeleteByAsync(_mapper, c => c.Id == id, cancellationToken);
            await _commentDbContext.SaveChangesAsync(cancellationToken);

            course.Rating = await _commentDbContext.Comments
                .GetAvarage(x => x.CourseId == course.Id && x.Rating != default, x => x.Rating);

            await _courseDbContext.SaveChangesAsync(cancellationToken);

            var user = await _userDbContext.Users
                .GetAsync(_mapper, u => u.Id == course.CreatorId, new() { }, cancellationToken);

            user.Rating = await _courseDbContext.Courses
                .GetAvarage(x => x.CreatorId == user.Id && x.Rating != default, c => c.Rating);

            await _userDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
