using System;
using System.Collections.Generic;
using Domain.Interfaces;


namespace Domain.Models
{
    public class Chapter : IEntity<Guid>
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid CourseId { get; set; }
        public Course Course { get; set; }
        public virtual ICollection<Video> Videos { get; set; }
    }
}
