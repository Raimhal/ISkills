using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace Domain.Interfaces
{
    public interface IThemeDbContext : IBaseDbContext
    {
        DbSet<Theme> Themes { get; set; }
    }
}
