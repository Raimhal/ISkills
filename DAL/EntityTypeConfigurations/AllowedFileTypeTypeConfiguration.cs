using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Models;

namespace DAL.EntityTypeConfigurations
{
    public class AllowedFileTypeTypeConfiguration : IEntityTypeConfiguration<AllowedFileType>
    {
        public void Configure(EntityTypeBuilder<AllowedFileType> builder)
        {
            builder.ToTable("AllowedFileTypes").HasKey(ef => ef.Id);
            builder.HasIndex(e => e.Id).IsUnique();
            builder.Property(e => e.FileType).IsRequired();
            builder.Property(e => e.FileSize).IsRequired();
        }
    }
}
