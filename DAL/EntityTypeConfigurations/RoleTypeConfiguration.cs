using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Models;

namespace DAL.EntityTypeConfigurations
{
    public class RoleEntityTypeConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.ToTable("Roles").HasKey(p => p.Id);
            builder.HasMany(r => r.Users).WithMany(p => p.Roles);

        }
    }
}
