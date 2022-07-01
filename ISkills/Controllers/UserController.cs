using BLL.DtoModels;
using BLL.Interfaces;
using Domain.Models;
using ISkills.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Iskills.Controllers
{
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IUserRepository _userService;
        private readonly IAccessRepository _accessService;

        public UserController(IUserRepository userService, IAccessRepository accessService) =>
            (_userService, _accessService) = (userService, accessService);


        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("api/users/all")]
        public async Task<ActionResult<List<UserDto>>> GetUsersAll(CancellationToken cancellationToken = default, 
            string query = "", string sortOption = "Email", bool reverse = false, Guid? courseId = null)
            => Ok(await _userService.GetListAll(query, sortOption, reverse, cancellationToken, courseId));


        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("api/users")]
        public async Task<ActionResult<List<UserDto>>> GetUsers(CancellationToken cancellationToken = default, 
            int skip = 0, int take = 10, string query="", string sortOption = "Email", bool reverse = false, Guid? courseId = null)
        {
            var content = await _userService.GetList(skip, take, query, sortOption, reverse, cancellationToken, courseId);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }


        [Authorize]
        [HttpGet]
        [Route("api/users/{id}")]
        public async Task<ActionResult<User>> GetUser(Guid id, CancellationToken cancellationToken = default)
        {
            if (!await _accessService.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            return Ok(await _userService.GetByIdAsync(id, cancellationToken));
        }


        [HttpGet]
        [Route("api/users/{id}/short-information")]
        public async Task<ActionResult<UserDetailsDto>> GetUserShortInfo(Guid id, CancellationToken cancellationToken = default)
            => Ok(await _userService.GetShortInfoByIdAsync(id, cancellationToken));


        [Authorize]
        [HttpGet]
        [Route("api/users/by-email")]
        public async Task<ActionResult<User>> GetUserByEmail(string email, CancellationToken cancellationToken = default)
            => Ok(await GetUser(await _userService.GetIdFromEmail(email, cancellationToken), cancellationToken));
        

        [Authorize]
        [HttpGet]
        [Route("api/users/current")]
        public async Task<ActionResult<UserDto>> GetCurrentUser(CancellationToken cancellationToken = default)
            => Ok(await _userService.GetByIdAsync(UserId, cancellationToken));


        [AllowAnonymous]
        [HttpPost]
        [Route("api/users")]
        public async Task<ActionResult<Guid>> CreateUser([FromBody] RegisterUserModel model,
            CancellationToken cancellationToken = default)
            => Ok(await _userService.CreateAsync(model, cancellationToken));


        [Authorize]
        [HttpPut]
        [Route("api/users/{id}/full")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] RegisterUserModel model,
            CancellationToken cancellationToken = default)
        {
            if (!await _accessService.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            await _userService.UpdateAsync(id, model, cancellationToken);
            return NoContent();
        }

        [Authorize]
        [HttpPut]
        [Route("api/users/{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserModel model,
            CancellationToken cancellationToken = default)
        {
            if (!await _accessService.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            await _userService.PartlyUpdateAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpPatch]
        [Route("api/users/{id}")]
        public async Task<ActionResult<string>> UpdateUserImage(Guid id, [FromForm] IFormFile file,
            CancellationToken cancellationToken = default, int width = 256, int height = 256)
        {
            if (!await _accessService.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            return Ok(await _userService.UpdateImageAsync(id, file, width, height, cancellationToken));
        }


        [Authorize]
        [HttpDelete]
        [Route("api/users/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id, CancellationToken cancellationToken = default)
        {
            if (!await _accessService.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            await _userService.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }

    }
}
