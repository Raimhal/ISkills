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
            builder.Property(c => c.Content).HasMaxLength(2048).IsRequired();
            builder.HasOne(c => c.User).WithMany(u => u.Comments).HasForeignKey(c => c.CreatorId);
            builder.HasOne(c => c.Course).WithMany(u => u.Comments).HasForeignKey(c => c.CourseId);
        }
    }
}
