using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Models;

namespace DAL.EntityTypeConfigurations
{
    public class CommentTypeConfiguration : IEntityTypeConfiguration<Comment>
    {
        public void Configure(EntityTypeBuilder<Comment> builder)
        {

            builder.ToTable("Comments").HasKey(c => c.Id);
            builder.HasIndex(c => c.Id).IsUnique();
            builder.Property(c => c.Content).IsRequired();
            builder.Property(c => c.Date).IsRequired();
            builder.Property(c => c.DateUpdated).IsRequired();
            builder.HasOne(c => c.Creator).WithMany(u => u.Comments).HasForeignKey(c => c.CreatorId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(c => c.Course).WithMany(u => u.Comments).HasForeignKey(c => c.CourseId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
