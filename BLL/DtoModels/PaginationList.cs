using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DtoModels
{ 
    public class PaginationList<T>
    {
        public long TotalCount { get; set; }
        public List<T> List { get; set; }
    }
}
