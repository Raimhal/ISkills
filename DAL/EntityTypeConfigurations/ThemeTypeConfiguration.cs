using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Models;

namespace DAL.EntityTypeConfigurations
{
    public class ThemeTypeConfiguration : IEntityTypeConfiguration<Theme>
    {
        public void Configure(EntityTypeBuilder<Theme> builder)
        {

            builder.ToTable("Themes").HasKey(t => t.Id);
            builder.HasIndex(t => t.Id).IsUnique();
            builder.Property(t => t.Title).HasMaxLength(256).IsRequired();
            builder.HasOne(t => t.Category).WithMany(c => c.Themes).HasForeignKey(t => t.CategoryId);
        }
    }
}
