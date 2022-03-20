using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Iskills.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        internal Guid UserId => !User.Identity.IsAuthenticated ? Guid.Empty 
            : Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);


    }
}
