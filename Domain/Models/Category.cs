using System;
using System.Collections.Generic;
using Domain.Interfaces;


namespace Domain.Models
{
    public class Category : IEntity<int>
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public virtual ICollection<Theme> Themes { get; set; }
    }
}
