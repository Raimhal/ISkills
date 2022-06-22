using BLL.DtoModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IAdditionalOperations<IdType, TFModelDto>
    {
        Task UpdateAsync(IdType id, TFModelDto model, CancellationToken cancellationToken);
        Task DeleteByIdAsync(IdType id, CancellationToken cancellationToken);
    }
}
