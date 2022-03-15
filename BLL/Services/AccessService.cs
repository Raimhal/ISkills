using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using BLL.Interfaces;
using Domain.Interfaces;
using Domain.Models;
using System.Collections.Generic;

namespace BLL.Services
{

    public class AccessService : IAccessService
    {
        private readonly IUserService _userService;
        private readonly ICourseService _courseService;
        private readonly ICommentService _commentService;
        private readonly string AdminRoleName = "Admin";

        public AccessService(IUserService userService, ICourseService courseService,
            ICommentService commentService) 
            => (_userService, _courseService, _commentService) 
            = (userService, courseService, commentService);


        public async Task<bool> HasAccessToCourse(Guid userId, Guid id)
            => await IsAdmin(userId)
            || (await _courseService.GetByIdAsync(id)).CreatorId == userId;


        public async Task<bool> HasAccessToComment(Guid userId, Guid id)
            => await IsAdmin(userId)
            || (await _commentService.GetByIdAsync(id)).CreatorId == userId;


        public async Task<bool> HasAccessToUser(Guid userId, Guid id)
            => await IsAdmin(userId)
            || userId == id;


        private async Task<bool> IsAdmin(Guid id)
            => (await _userService.GetByIdAsync(id))
            .Roles.Any(r => r.Name == AdminRoleName);

    }
}
