using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace Domain.Interfaces
{
    public interface ICategoryDbContext : IBaseDbContext
    {
        DbSet<Category> Categories { get; set; }
    }
}
