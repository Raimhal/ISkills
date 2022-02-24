using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace Domain.Interfaces
{
    public interface ICommentDbContext : IBaseDbContext
    {
        DbSet<Comment> Comments { get; set; }
    }
}
