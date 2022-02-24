using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IBaseService<TModel, TFModelDto, TModelDto>
    {
        Task<List<TModelDto>> GetList(int skip, int take, string query, string sortOption, bool reverse);
        Task<List<TModelDto>> GetListAll(string query, string sortOption, bool reverse);
        Task<TModel> GetByIdAsync(Guid id);
        Task<Guid> CreateAsync(TFModelDto model, CancellationToken cancellationToken);
        Task UpdateAsync(Guid id, TFModelDto model, CancellationToken cancellationToken);
        Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken);

    }
}
