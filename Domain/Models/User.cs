using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Domain.Interfaces;

namespace Domain.Models
{
    public class User : IEntity<Guid>
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }

        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [DataType(DataType.Password)]
        public string Password { get; set; }
        public string Salt { get; set; }
        public string ImageUrl { get; set; }
        public double Rating { get; set; }

        public virtual ICollection<Role> Roles { get; set; }
        public virtual ICollection<Course> Courses { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
    }
}
