using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using BLL.Interfaces;
using Domain.Interfaces;
using Domain.Models;

namespace BLL.Services
{

    public class AccessService : IAccessService
    {
        private readonly IUserService _userService;
        private readonly string AdminRoleName = "Admin";

        public AccessService(IUserService userService) =>
            (_userService) = (userService);

        public async Task<bool> HasAccessToCourse(Guid userId, Guid courseId)
        {
            var user = await _userService.GetByIdAsync(userId);

            if (user.Roles.Any(r => r.Name == AdminRoleName))
                return true;

            return user.Courses.Any(c => c.Id == courseId);
        }

        public async Task<bool> HasAccessToUser(Guid userId, Guid id)
        {
            var user = await _userService.GetByIdAsync(userId);

            if (user.Roles.Any(r => r.Name == AdminRoleName))
                return true;

            return userId == id;

        }
    }
}
