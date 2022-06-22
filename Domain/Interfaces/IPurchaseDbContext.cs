using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace Domain.Interfaces
{
    public interface IPurchaseDbContext : IBaseDbContext
    {
        DbSet<Purchase> Purchases { get; set; }
    }
}
