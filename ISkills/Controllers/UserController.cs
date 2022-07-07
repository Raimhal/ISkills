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
        private readonly IUserRepository _userRepository;
        private readonly IAccessRepository _accessRepository;

        public UserController(IUserRepository userRepository, IAccessRepository accessRepository) =>
            (_userRepository, _accessRepository) = (userRepository, accessRepository);


        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("api/users/all")]
        public async Task<ActionResult<List<UserDto>>> GetUsersAll(CancellationToken cancellationToken = default, 
            string query = "", string sortOption = "Email", bool reverse = false, Guid? courseId = null)
            => Ok(await _userRepository.GetListAll(query, sortOption, reverse, cancellationToken, courseId));


        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("api/users")]
        public async Task<ActionResult<List<UserDto>>> GetUsers(CancellationToken cancellationToken = default, 
            int skip = 0, int take = 10, string query="", string sortOption = "Email", bool reverse = false, Guid? courseId = null)
        {
            var content = await _userRepository.GetList(skip, take, query, sortOption, reverse, cancellationToken, courseId);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("api/users/top")]
        public async Task<ActionResult<List<UserDto>>> GetTopUsers(CancellationToken cancellationToken = default)
            => Ok(await _userRepository.GetTopUsers(cancellationToken));


        [Authorize]
        [HttpGet]
        [Route("api/users/{id}")]
        public async Task<ActionResult<User>> GetUser(Guid id, CancellationToken cancellationToken = default)
        {
            if (!await _accessRepository.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            return Ok(await _userRepository.GetByIdAsync(id, cancellationToken));
        }


        [HttpGet]
        [Route("api/users/{id}/short-information")]
        public async Task<ActionResult<UserDetailsDto>> GetUserShortInfo(Guid id, CancellationToken cancellationToken = default)
            => Ok(await _userRepository.GetShortInfoByIdAsync(id, cancellationToken));


        [Authorize]
        [HttpGet]
        [Route("api/users/by-email")]
        public async Task<ActionResult<User>> GetUserByEmail(string email, CancellationToken cancellationToken = default)
            => Ok(await GetUser(await _userRepository.GetIdFromEmail(email, cancellationToken), cancellationToken));
        

        [Authorize]
        [HttpGet]
        [Route("api/users/current")]
        public async Task<ActionResult<UserDto>> GetCurrentUser(CancellationToken cancellationToken = default)
            => Ok(await _userRepository.GetByIdAsync(UserId, cancellationToken));


        [AllowAnonymous]
        [HttpPost]
        [Route("api/users")]
        public async Task<ActionResult<Guid>> CreateUser([FromBody] RegisterUserModel model,
            CancellationToken cancellationToken = default)
            => Ok(await _userRepository.CreateAsync(model, cancellationToken));


        [Authorize]
        [HttpPut]
        [Route("api/users/{id}/full")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] RegisterUserModel model,
            CancellationToken cancellationToken = default)
        {
            if (!await _accessRepository.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            await _userRepository.UpdateAsync(id, model, cancellationToken);
            return NoContent();
        }

        [Authorize]
        [HttpPut]
        [Route("api/users/{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserModel model,
            CancellationToken cancellationToken = default)
        {
            if (!await _accessRepository.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            await _userRepository.PartlyUpdateAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpPatch]
        [Route("api/users/{id}")]
        public async Task<ActionResult<string>> UpdateUserImage(Guid id, [FromForm] IFormFile file,
            CancellationToken cancellationToken = default, int width = 256, int height = 256)
        {
            if (!await _accessRepository.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            return Ok(await _userRepository.UpdateImageAsync(id, file, width, height, cancellationToken));
        }


        [Authorize]
        [HttpDelete]
        [Route("api/users/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id, CancellationToken cancellationToken = default)
        {
            if (!await _accessRepository.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            await _userRepository.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }

    }
}
