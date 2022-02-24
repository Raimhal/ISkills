using System.ComponentModel.DataAnnotations;
using Domain.Interfaces;

namespace Domain.Models
{
    public class AllowedFileType : IEntity<int>
    {
        [Key]
        public int Id { get; set; }
        public string FileType { get; set; }
        public double FileSize { get; set; }
    }
}
