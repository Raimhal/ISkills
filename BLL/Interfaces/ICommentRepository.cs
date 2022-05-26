using BLL.DtoModels;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface ICommentRepository : IBaseRepository<Guid, Comment, CreateCommentDto, CommentDto>
    {
    }
}
