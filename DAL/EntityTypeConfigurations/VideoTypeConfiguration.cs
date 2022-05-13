using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Models;

namespace DAL.EntityTypeConfigurations
{
    public class VideoTypeConfiguration : IEntityTypeConfiguration<Video>
    {
        public void Configure(EntityTypeBuilder<Video> builder)
        {

            builder.ToTable("Videos").HasKey(v => v.Id);
            builder.HasIndex(v => v.Id).IsUnique();
            builder.Property(v => v.Title).HasMaxLength(256).IsRequired();
            builder.Property(v => v.Url).IsRequired();
            builder.HasOne(v => v.Chapter).WithMany(c => c.Videos).HasForeignKey(c => c.ChapterId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
