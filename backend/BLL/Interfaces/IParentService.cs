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
        Task<PaginationList<TDto>> GetParentItems(IdType parentId, int skip, int take, string query, string sortOption, bool reverse, CancellationToken cancellationToken);
        Task<List<TDto>> GetParentItemsAll(IdType parentId, string query, string sortOption, bool reverse, CancellationToken cancellationToken);
    }
}
