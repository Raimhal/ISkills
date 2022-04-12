using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace Domain.Interfaces
{
    public interface IRoleDbContext : IBaseDbContext
    {
        DbSet<Role> Roles { get; set; }
    }
}

