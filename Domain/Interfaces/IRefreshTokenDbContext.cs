using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace Domain.Interfaces
{
    public interface IRefreshTokenDbContext : IBaseDbContext
    {
        DbSet<RefreshToken> RefreshTokens { get; set; }
    }
}
