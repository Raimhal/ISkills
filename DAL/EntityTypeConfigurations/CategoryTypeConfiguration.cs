using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Models;

namespace DAL.EntityTypeConfigurations
{
    public class CategoryTypeConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {

            builder.ToTable("Categories").HasKey(c => c.Id);
            builder.HasIndex(c => c.Id).IsUnique();
            builder.Property(c => c.Title).HasMaxLength(256).IsRequired();
        }
    }
}
