﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using System.Collections.Generic;
using Domain.Models;
using Microsoft.AspNetCore.Http;
using ISkills.Controllers;

namespace Iskills.Controllers
{
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IUserService _userService;
        private readonly IAccessService _accessService;

        public UserController(IUserService userService, IAccessService accessService) =>
            (_userService, _accessService) = (userService, accessService);


        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("api/users/all")]
        public async Task<ActionResult<List<UserDto>>> GetUsersAll(CancellationToken cancellationToken, 
            string query = "", string sortOption = "Email", bool reverse = false)
            => Ok(await _userService.GetListAll(query, sortOption, reverse, cancellationToken));


        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("api/users")]
        public async Task<ActionResult<List<UserDto>>> GetUsers(CancellationToken cancellationToken, 
            int skip = 0, int take = 10, string query="", string sortOption = "Email", bool reverse = false)
        {
            var content = await _userService.GetList(skip, take, query, sortOption, reverse, cancellationToken);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }


        [Authorize]
        [HttpGet]
        [Route("api/users/{id}")]
        public async Task<ActionResult<User>> GetUser(Guid id, CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            return Ok(await _userService.GetByIdAsync(id, cancellationToken));
        }

        [HttpGet]
        [Route("api/courses/{id}/students/all")]
        public async Task<ActionResult<List<CommentDto>>> GetCourseStudentsAll(Guid id, CancellationToken cancellationToken,
            string query = "", string sortOption = "username", bool reverse = false)
            => Ok(await _userService.GetParentItemsAll(id, query, sortOption, reverse, cancellationToken));


        [HttpGet]
        [Route("api/courses/{id}/students")]
        public async Task<ActionResult<List<CommentDto>>> GetCourseStudents(Guid id, CancellationToken cancellationToken,
            int skip = 0, int take = 10, string query = "", string sortOption = "username", bool reverse = false)
        {
            var content = await _userService.GetParentItems(id, skip, take, query, sortOption, reverse, cancellationToken);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }


        [HttpGet]
        [Route("api/users/{id}/short-information")]
        public async Task<ActionResult<UserDto>> GetUserShortInfo(Guid id, CancellationToken cancellationToken)
            => Ok(await _userService.GetShortInfoByIdAsync(id, cancellationToken));


        [Authorize]
        [HttpGet]
        [Route("api/users/by-email")]
        public async Task<ActionResult<User>> GetUserByEmail(string email, CancellationToken cancellationToken)
            => Ok(await GetUser(await _userService.GetIdFromEmail(email, cancellationToken), cancellationToken));
        

        [Authorize]
        [HttpGet]
        [Route("api/users/current")]
        public async Task<ActionResult<UserDto>> GetCurrentUser(CancellationToken cancellationToken)
            => Ok(await _userService.GetByIdAsync(UserId, cancellationToken));


        [AllowAnonymous]
        [HttpPost]
        [Route("api/users")]
        public async Task<ActionResult<Guid>> CreateUser([FromBody] RegisterUserModel model,
            CancellationToken cancellationToken)
            => Ok(await _userService.CreateAsync(model, cancellationToken));


        [Authorize]
        [HttpPut]
        [Route("api/users/{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] RegisterUserModel model,
            CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            await _userService.UpdateAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpPatch]
        [Route("api/users/{id}")]
        public async Task<IActionResult> UpdateUserImage(Guid id, [FromForm] IFormFile file,
            CancellationToken cancellationToken, int width = 128, int height = 128)
        {
            if (!await _accessService.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            await _userService.UpdateImageAsync(id, file, width, height, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpDelete]
        [Route("api/users/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id, CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            await _userService.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }

    }
}
