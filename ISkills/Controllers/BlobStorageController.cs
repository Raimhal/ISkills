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
    public class BlobStorageCotroller : BaseController
    {
        private readonly IBlobStorage _blobStorage;

        public BlobStorageCotroller(IBlobStorage blobStorage) =>
            _blobStorage = blobStorage;


        [AllowAnonymous]
        [HttpPost]
        [Route("api/upload")]
        public async Task<IActionResult> Upload([FromForm] CreateVideoDto model)
        {
            await _blobStorage.AddToStorage(model.File);
            return Ok();
        }
        //public async Task<IActionResult> Authenticate(AuthenticateRequest authenticateRequest, CancellationToken cancellationToken)
        //{
        //    var tokens = await _accountService.Authenticate(authenticateRequest, GetIp(), cancellationToken);

        //    if(tokens == null)
        //        return BadRequest(new { message = "Username or password is incorrect" });

        //    SetTokenCookie(tokens.RefreshToken);
        //    return Ok(tokens);
        //}


    }
}