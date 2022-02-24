using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using System.Collections.Generic;
using Domain.Models;

namespace Iskills.Controllers
{
    [ApiController]
    public class UsersController : BaseController
    {
        private readonly IUserService _userService;
        private readonly IAccessService _accessService;

        public UsersController(IUserService userService, IAccessService accessService) =>
            (_userService, _accessService) = (userService, accessService);


        [HttpGet]
        [Route("api/users/all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<UserDto>>> GetUsersAll(string query="",
            string sortOption = "Email", bool reverse = false)
            => Ok(await _userService.GetListAll(query, sortOption, reverse));

        [HttpGet]
        [Route("api/users")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<UserDto>>> GetUsers(int skip = 0, int take = 10,
            string query="", string sortOption = "Email", bool reverse = false)
            => Ok(await _userService.GetList(skip, take, query, sortOption, reverse));

        [HttpGet]
        [Route("api/users/{id}")]
        [Authorize]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            if (await _accessService.HasAccessToUser(UserId, id))
            {
                var user = await _userService.GetByIdAsync(id);
                return Ok(user);
            }
            return StatusCode(401);
        }

        [HttpGet]
        [Route("api/users/email")]
        [Authorize]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            var id = await _userService.GetIdFromEmail(email);
            if (await _accessService.HasAccessToUser(UserId, id))
            {
                var user = await _userService.GetByIdAsync(id);
                return Ok(user);
            }
            return StatusCode(401);
        }

        [Authorize]
        [HttpGet]
        [Route("api/users/current")]
        public async Task<ActionResult<Guid>> GetCurrentUserId()
            => Ok(await _userService.GetByIdAsync(UserId));


        [AllowAnonymous]
        [HttpPost]
        [Route("api/users")]
        public async Task<ActionResult<Guid>> CreateUser([FromBody] RegisterUserModel model,
            CancellationToken cancellationToken)
            => Ok(await _userService.CreateAsync(model, cancellationToken));

        [Authorize]
        [HttpPut]
        [Route("api/users/{id}/update")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] RegisterUserModel model,
            CancellationToken cancellationToken)
        {
            if (await _accessService.HasAccessToUser(UserId, id))
            {
                await _userService.UpdateAsync(id, model, cancellationToken);
                return NoContent();
            }
            return StatusCode(401);
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("api/users/{id}/delete")]
        public async Task<IActionResult> DeleteUser(Guid id, CancellationToken cancellationToken)
        {
            await _userService.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }

    }
}
