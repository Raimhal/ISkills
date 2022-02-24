using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;

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
        [Route("api/users")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserListVm>> GetUsers()
        {
            var users = await _userService.GetAll();
            return Ok(users);
        }

        [HttpGet]
        [Route("api/users/{id}")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetUser(Guid id)
        {
            if (await _accessService.HasAccessToUser(UserId, id))
            {
                var user = await _userService.GetByIdAsync(id);
                return Ok(user);
            }
            return StatusCode(401);
        }

        [HttpGet]
        [Route("api/users/{email}/email")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetUserByEmail(string email)
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
        {
            return Ok(await _userService.GetByIdAsync(UserId));
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("api/users")]
        public async Task<ActionResult<Guid>> CreateUser([FromBody] RegisterUserModel model,
            CancellationToken cancellationToken)
        {
            var user = await _userService.CreateAsync(model, cancellationToken);
            return Ok(user);
        }

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
