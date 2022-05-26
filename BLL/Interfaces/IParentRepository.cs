using BLL.DtoModels;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IParentRepository<IdType, TDto>
    { 
        Task<PaginationList<TDto>> GetParentItems(int skip, int take, string query, string sortOption, bool reverse, CancellationToken cancellationToken, params object[] dynamics);
        Task<List<TDto>> GetParentItemsAll(string query, string sortOption, bool reverse, CancellationToken cancellationToken, params object[] dynamics);
    }
}
