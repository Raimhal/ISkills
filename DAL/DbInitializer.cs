using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using BLL.Validation;
using Domain.Models;

namespace DAL
{
    public class DbInitializer
    {
        public static void Initialize(IskillsContext context)
        {
            context.Database.EnsureCreated();
        }

        public static void DataSeed(IskillsContext context)
        {
            if (!context.Users.Any())
            {
                var adminRoleName = "Admin";
                var userRoleName = "User";

                var adminRole = context.Roles
                    .FirstOrDefault(r => r.Name == adminRoleName);

                if (adminRole == null)
                {

                    adminRole = new Role
                    {
                        Id = 1,
                        Name = adminRoleName
                    };

                    var userRole = new Role
                    {
                        Id = 2,
                        Name = userRoleName
                    };
                    context.Roles.AddRangeAsync(adminRole, userRole);
                }

                var salt = Hasher.GenerateSalt(size: 16);

                var admin = new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Admin",
                    LastName = "Admin",
                    UserName = "Admin",
                    Email = "admin@gmail.com",
                    Salt = salt,
                    Password = Hasher.GetSaltedHash(
                        password: "admin",
                        salt: salt
                    ),
                    Roles = new List<Role> { adminRole }
                };

                context.Users.Add(admin);

                context.AllowedFileTypes.AddRange
                    (
                    new ()
                    {
                        Id = 1,
                        FileType = "mp4",
                        FileSize = 100
                    },
                    new ()
                    {
                        Id = 2,
                        FileType = "jpg",
                        FileSize = 10
                    },
                    new ()
                    {

                        Id = 3,
                        FileType = "png",
                        FileSize = 10
                    },
                    new ()
                    {
                        Id = 4,
                        FileType = "gif",
                        FileSize = 10
                    },
                    new ()
                    {
                        Id = 5,
                        FileType = "avi",
                        FileSize = 100
                    },
                    new ()
                    {
                        Id = 6,
                        FileType = "pdf",
                        FileSize = 100
                    },
                    new ()
                    {
                        Id = 7,
                        FileType = "jpeg",
                        FileSize = 10
                    },
                    new()
                    {
                        Id = 8,
                        FileType = "sql",
                        FileSize = 10
                    }
                    );

                var category = new Category
                {
                    Id = 1,
                    Title = "Other"
                };

                context.Categories.Add(category);

                var theme = new Theme
                {
                    Id = 1,
                    Title = "Other",
                    Category = category
                };

                context.Themes.Add(theme);

                context.SaveChanges();
            }
                
            
        }
    }
}
