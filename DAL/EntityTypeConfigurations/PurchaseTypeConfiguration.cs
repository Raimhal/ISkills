using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Models;

namespace DAL.EntityTypeConfigurations
{
    public class PurchaseTypeConfiguration : IEntityTypeConfiguration<Purchase>
    {
        public void Configure(EntityTypeBuilder<Purchase> builder)
        {

            builder.ToTable("Purchases").HasKey(c => c.Id);
            builder.HasIndex(c => c.Id).IsUnique();
            builder.Property(c => c.Date).IsRequired();
            builder.HasOne(c => c.Course).WithMany(u => u.Purchases).HasForeignKey(c => c.CourseId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
