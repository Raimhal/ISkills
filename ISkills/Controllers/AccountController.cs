using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;

namespace Iskills.Controllers
{
    [Authorize]
    public class AccountController : BaseController
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService) =>
            _accountService = accountService;


        [AllowAnonymous]
        [HttpPost]
        [Route("api/account/authenticate")]
        public async Task<IActionResult> Authenticate(AuthenticateRequest authenticateRequest, CancellationToken cancellationToken)
        {
            var tokens = await _accountService.Authenticate(authenticateRequest, GetIp(), cancellationToken);

            if(tokens == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            SetTokenCookie(tokens.RefreshToken);
            return Ok(tokens);
        }


        [HttpPost]
        [Route("api/account/refresh-token")]
        public async Task<IActionResult> RefreshToken(CancellationToken cancellationToken)
        {
            var refreshToken = Request.Cookies["refreshToken"];

            var responce = await _accountService.RefreshToken(refreshToken, GetIp(), cancellationToken);

            if(responce == null)
                return Unauthorized(new { message = "Invalid token" });

            SetTokenCookie(responce.RefreshToken);
            return Ok(responce);
        }


        [HttpPost]
        [Route("api/account/revoke-token")]
        public async Task<IActionResult> RevokeToken([FromForm]string token, CancellationToken cancellationToken)
        {
            var revokedToken = token ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(revokedToken))
                return BadRequest(new { messsage = "Token is required" });

            var responce = await _accountService.RevokeToken(token, GetIp(), cancellationToken);

            if (!responce) 
                return NotFound(new { message = "Token not found" });
            return Ok(new { message = "Token revoked" });
        }


        private string GetIp()
            => Request.Headers.ContainsKey("X-Forwarded-For")
            ? Request.Headers["X-Forwarded-For"]
            : HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        

        private void SetTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddMinutes(5)
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }
    }
}