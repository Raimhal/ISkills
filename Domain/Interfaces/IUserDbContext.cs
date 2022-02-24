using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace Domain.Interfaces
{
    public interface IUserDbContext : IBaseDbContext
    {
        DbSet<User> Users { get; set; }
    }
}
