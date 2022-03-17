using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Models;

namespace DAL.EntityTypeConfigurations
{
    public class CourseTypeConfiguration : IEntityTypeConfiguration<Course>
    {
        public void Configure(EntityTypeBuilder<Course> builder)
        {
            builder.ToTable("Courses").HasKey(p => p.Id);
            builder.HasIndex(p => p.Id).IsUnique();
            builder.Property(p => p.Title).HasMaxLength(256).IsRequired();
            builder.Property(p => p.ShortInfo).HasMaxLength(256);
            builder.Property(p => p.Requirements).HasMaxLength(2048);
            builder.Property(p => p.Description).HasMaxLength(2048);
            builder.Property(p => p.DateCreated).IsRequired();
            builder.Property(p => p.DateUpdated).IsRequired();
            builder.Property(p => p.Language).HasMaxLength(64).IsRequired();
            builder.HasOne(p => p.Theme).WithMany(t => t.Courses).HasForeignKey(p => p.ThemeId);
            builder.HasMany(p => p.Students).WithMany(u => u.Courses);
        }
    }
}
