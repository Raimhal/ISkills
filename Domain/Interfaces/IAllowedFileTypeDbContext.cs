using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace Domain.Interfaces
{
    public interface IAllowedFileTypeDbContext : IBaseDbContext
    {
        DbSet<AllowedFileType> AllowedFileTypes { get; set; }
    }
}
