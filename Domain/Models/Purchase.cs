using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Purchase : IEntity<Guid>
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public Guid CourseId { get; set; }
        public Course Course { get; set; }
    }
}
