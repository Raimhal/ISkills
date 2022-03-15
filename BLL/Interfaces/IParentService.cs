using BLL.DtoModels;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IParentService<IdType, TDto>
    { 
        Task<List<TDto>> GetParentItems(IdType chapterId, int skip, int take, string query, string sortOption, bool reverse);
        Task<List<TDto>> GetParentItemsAll(IdType chapterId, string query, string sortOption, bool reverse);
    }
}
