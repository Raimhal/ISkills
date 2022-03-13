using System;
using System.Collections.Generic;
using Domain.Interfaces;


namespace Domain.Models
{
    public class Theme : IEntity<int>
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public int CountCourses => Courses.Count;
        public virtual ICollection<Course> Courses { get; set; }
    }
}
