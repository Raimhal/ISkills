using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Models;

namespace DAL.EntityTypeConfigurations
{
    public class ChapterTypeConfiguration : IEntityTypeConfiguration<Chapter>
    {
        public void Configure(EntityTypeBuilder<Chapter> builder)
        {

            builder.ToTable("Chapters").HasKey(c => c.Id);
            builder.HasIndex(e => e.Id).IsUnique();
            builder.Property(c => c.Title).HasMaxLength(128).IsRequired();
            builder.Property(c => c.Description).HasMaxLength(512);
            builder.HasOne(c => c.Course).WithMany(p => p.Chapters).HasForeignKey(c => c.CourseId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
