using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DtoModels
{ 
    public class UserGroupedItem
    {
        public string Email { get; set; }
        public double Rating { get; set; }
        public int Amount { get; set; }
        public string ImageUrl { get; set; }
    }
}
