using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Domain.Interfaces;

namespace Domain.Models
{
    public class Comment : IEntity<Guid>
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public DateTime DateUpdated { get; set; }
        public int Rating { get; set; }   
        public Guid CourseId { get; set; }
        public Guid CreatorId { get; set; }
        public Course Course { get; set; }
        public User Creator { get; set; }
    }
}
