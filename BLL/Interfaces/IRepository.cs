using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IRepository<IdType, TModel, TFModelDto, TModelDto> : IBaseRepository<IdType, TModel, TFModelDto, TModelDto>, IAdditionalOperations<IdType, TFModelDto>
    {

    }
}
