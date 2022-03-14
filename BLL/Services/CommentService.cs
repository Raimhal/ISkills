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

        public async Task<List<CommentDto>> GetList(int skip, int take, string query, string sortOption, bool reverse)
            => await LookUp.GetListAsync<Comment, CommentDto>(
                _commentDbContext.Comments,
                _mapper,
                skip,
                take,
                c => c.Content.Contains(query.ToLower().Trim()),
                sortOption,
                reverse);

        public async Task<List<CommentDto>> GetListAll(string query, string sortOption, bool reverse)
            => await LookUp.GetListAllAsync<Comment, CommentDto>(
                _commentDbContext.Comments,
                _mapper,
                c => c.Content.Contains(query.ToLower().Trim()),
                sortOption,
                reverse);

        public async Task<Comment> GetByIdAsync(Guid id)
            => await LookUp.GetAsync(
                _commentDbContext.Comments,
                _mapper,
                x => x.Id == id,
                includes);

        public async Task<Guid> CreateAsync(CreateCommentDto model, CancellationToken cancellationToken)
        {
            Expression<Func<User, bool>> expression = u => u.Id == model.CreatorId;
            if (!await _userDbContext.Users.AnyAsync(expression, cancellationToken))
                throw new NotFoundException(nameof(User), nameof(model.CreatorId), model.CreatorId);

            Expression<Func<Course, bool>> courseExpression = t => t.Id == model.CourseId;
            if (!await _courseDbContext.Courses.AnyAsync(courseExpression, cancellationToken))
                throw new NotFoundException(nameof(Course), nameof(model.CourseId), model.CreatorId);

            var comment = _mapper.Map<Comment>(model);

            await _commentDbContext.Comments.AddAsync(comment, cancellationToken);
            await _commentDbContext.SaveChangesAsync(cancellationToken);

            return comment.Id;
        }

        public async Task UpdateAsync(Guid id, CreateCommentDto model, CancellationToken cancellationToken)
        {
            var comment = await LookUp.GetAsync<Comment>(_commentDbContext.Comments,
                _mapper, c => c.Id == id, new () { });

            comment = _mapper.Map<Comment>(model);
            comment.DateUpdated = DateTime.UtcNow;

            _commentDbContext.Comments.Update(comment);
            await _commentDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            await LookUp.DeleteByAsync<Comment>(_commentDbContext.Comments, _mapper, c => c.Id == id);
            await _courseDbContext.SaveChangesAsync(cancellationToken);
        }


    }
}
