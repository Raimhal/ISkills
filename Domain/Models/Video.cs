using Domain.Interfaces;
using System;


namespace Domain.Models
{
    public class Video : IEntity<Guid>
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public Guid ChapterId { get; set; }
        public Chapter Chapter { get; set; }
    }
}
