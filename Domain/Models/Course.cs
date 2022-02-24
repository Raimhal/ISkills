using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Domain.Interfaces;

namespace Domain.Models
{
    public class Course : IEntity<Guid>
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string ShortInfo { get; set; }
        public string Requirements { get; set; }
        public string Description { get; set; }
        public string Language { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public float Price { get; set; }
        public int CountStudents => Users.Count;
        public int CountComments => Comments.Count;
        public int ThemeId { get; set; }
        public Theme Theme { get; set; }
        public Guid CreatorId { get; set; }

        public virtual ICollection<User> Users { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<Chapter> Chapters { get; set; }
    }
}
