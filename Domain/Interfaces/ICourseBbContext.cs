using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace Domain.Interfaces
{
    public interface ICourseDbContext : IBaseDbContext
    {
        DbSet<Course> Courses { get; set; }
    }
}
