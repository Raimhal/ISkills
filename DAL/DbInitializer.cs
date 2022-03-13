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
                context.SaveChanges();
            }
                
            
        }
    }
}
