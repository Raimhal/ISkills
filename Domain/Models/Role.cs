using System.Collections.Generic;
using Domain.Interfaces;

namespace Domain.Models
{
    public class Role : IEntity<int>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<User> Users { get; set; }
    }
}
