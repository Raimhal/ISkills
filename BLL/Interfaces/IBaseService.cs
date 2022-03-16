﻿using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IBaseService<IdType, TModel, TFModelDto, TModelDto>
    {
        Task<List<TModelDto>> GetList(int skip, int take, string query, string sortOption, bool reverse, CancellationToken cancellationToken);
        Task<List<TModelDto>> GetListAll(string query, string sortOption, bool reverse, CancellationToken cancellationToken);
        Task<TModel> GetByIdAsync(IdType id, CancellationToken cancellationToken);
        Task<IdType> CreateAsync(TFModelDto model, CancellationToken cancellationToken);
        Task UpdateAsync(IdType id, TFModelDto model, CancellationToken cancellationToken);
        Task DeleteByIdAsync(IdType id, CancellationToken cancellationToken);

    }
}
