using BLL.DtoModels;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IBaseRepository<IdType, TModel, TFModelDto, TModelDto>
    {
        Task<List<TModelDto>> GetListAll(string query, string sortOption, bool reverse, CancellationToken cancellationToken, params object[] dynamics);
        Task<PaginationList<TModelDto>> GetList(int skip, int take, string query, string sortOption, bool reverse, CancellationToken cancellationToken, params object[] dynamics);
        Task<TModel> GetByIdAsync(IdType id, CancellationToken cancellationToken);
        Task<IdType> CreateAsync(TFModelDto model, CancellationToken cancellationToken);

    }
}
