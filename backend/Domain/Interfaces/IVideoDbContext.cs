using Domain.Models;
using Microsoft.EntityFrameworkCore;


namespace Domain.Interfaces
{
    public interface IVideoDbContext : IBaseDbContext
    {
        DbSet<Video> Videos { get; set; }
    }
}
