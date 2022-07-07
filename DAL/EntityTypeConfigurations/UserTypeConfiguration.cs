using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Models;

namespace DAL.EntityTypeConfigurations
{
    public class UserTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users").HasKey(p => p.Id);
            builder.HasIndex(p => new { p.Id, p.Email, p.UserName}).IsUnique();
            builder.Property(p => p.Email).HasMaxLength(64).IsRequired();
            builder.Property(p => p.Password).HasMaxLength(64).IsRequired();
            builder.Property(p => p.UserName).HasMaxLength(64).IsRequired();
            builder.Property(p => p.FirstName).HasMaxLength(64);
            builder.Property(p => p.LastName).HasMaxLength(64);
        }
    }
}
