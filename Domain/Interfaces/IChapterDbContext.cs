using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace Domain.Interfaces
{
    public interface IChapterDbContext : IBaseDbContext
    {
        DbSet<Chapter> Chapters { get; set; }
    }
}
