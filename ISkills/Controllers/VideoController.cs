using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using System.Collections.Generic;

namespace Iskills.Controllers
{
    [ApiController]
    public class VideoController : BaseController
    {
        private readonly IVideoService _videoService;
        private readonly IAccessService _accessService;

        public VideoController(IVideoService videoService, IAccessService accessService) => 
            (_videoService, _accessService) = (videoService, accessService);


        [HttpPost]
        [Route("api/videos")]
        public async Task<ActionResult<Guid>> CreateCourseComment([FromForm] CreateVideoDto model,
            CancellationToken cancellationToken)
            => Ok(await _videoService.CreateAsync(model, cancellationToken));
        

    }
}
