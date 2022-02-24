﻿using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Domain.Interfaces;
using DAL.EntityTypeConfigurations;


namespace DAL
{
    public class IskillsContext : DbContext, IUserDbContext,
        IRoleDbContext, IAllowedFileTypeDbContext, ICourseDbContext,
        ICommentDbContext, IChapterDbContext, IVideoDbContext, 
        IThemeDbContext, ICategoryDbContext
    {
        public IskillsContext(DbContextOptions<IskillsContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<AllowedFileType> AllowedFileTypes { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Chapter> Chapters { get; set; }
        public DbSet<Video> Videos { get; set; }
        public DbSet<Theme> Themes { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.ApplyConfiguration(new UserTypeConfiguration());
            modelBuilder.ApplyConfiguration(new RoleEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new RefreshTokenEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new AllowedFileTypeTypeConfiguration());
            modelBuilder.ApplyConfiguration(new CourseTypeConfiguration());
            modelBuilder.ApplyConfiguration(new CommentTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ChapterTypeConfiguration());
            modelBuilder.ApplyConfiguration(new VideoTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ThemeTypeConfiguration());
            modelBuilder.ApplyConfiguration(new CategoryTypeConfiguration());
            base.OnModelCreating(modelBuilder);

        }
    }
}

