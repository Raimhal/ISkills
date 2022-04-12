using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using System.Collections.Generic;

namespace ISkills.Controllers
{
    [ApiController]
    public class VideoController : BaseController
    {
        private readonly IVideoService _videoService;
        private readonly IAccessService _accessService;

        public VideoController(IVideoService videoService, IAccessService accessService)
            => (_videoService, _accessService) = (videoService, accessService);


        [HttpGet]
        [Route("api/videos/{id}")]
        public async Task<ActionResult<VideoDto>> GetVideo(Guid id, CancellationToken cancellationToken)
            => Ok(await _videoService.GetByIdAsync(id, cancellationToken));


        [HttpGet]
        [Route("api/videos/all")]
        public async Task<ActionResult<List<ChapterDto>>> GetVideosAll(CancellationToken cancellationToken, 
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _videoService.GetListAll(query, sortOption, reverse, cancellationToken));


        [HttpGet]
        [Route("api/videos")]
        public async Task<ActionResult<List<ChapterDto>>> GetVideos(CancellationToken cancellationToken, 
            int skip = 0, int take = 10, string query = "", string sortOption = "title", bool reverse = false)
        {
            var content = await _videoService.GetList(skip, take, query, sortOption, reverse, cancellationToken);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }


        [HttpGet]
        [Route("api/chapters/{id}/videos/all")]
        public async Task<ActionResult<List<ChapterDto>>> GetChaptersVideosAll(Guid id, CancellationToken cancellationToken,
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _videoService.GetParentItemsAll(id, query, sortOption, reverse, cancellationToken));


        [HttpGet]
        [Route("api/chapters/{id}/videos")]
        public async Task<ActionResult<List<ChapterDto>>> GetChaptersVideos(Guid id, CancellationToken cancellationToken,
            int skip = 0, int take = 10, string query = "", string sortOption = "title", bool reverse = false)
        {
            var content = await _videoService.GetParentItems(id, skip, take, query, sortOption, reverse, cancellationToken);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }


        [Authorize]
        [HttpPost]
        [Route("api/videos")]
        public async Task<ActionResult<Guid>> CreateChapterVideo([FromForm] CreateVideoDto model,
            CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToChapter(UserId, model.ChapterId, cancellationToken))
                return Forbid();

            return Ok(await _videoService.CreateAsync(model, cancellationToken));
        }


        [Authorize]
        [HttpPut]
        [Route("api/videos/{id}")]
        public async Task<IActionResult> UpdateVideo(Guid id, [FromForm] CreateVideoDto model,
            CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToVideo(UserId, id, cancellationToken))
                return Forbid();

            await _videoService.UpdateAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpPatch]
        [Route("api/videos/{id}")]
        public async Task<IActionResult> PatchVideo(Guid id, [FromBody] UpdateVideoDto model,
            CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToVideo(UserId, id, cancellationToken))
                return Forbid();

            await _videoService.PatchAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpDelete]
        [Route("api/videos/{id}")]
        public async Task<IActionResult> DeleteVideo(Guid id, CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToVideo(UserId, id, cancellationToken))
                return Forbid();

            await _videoService.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }
    }
}
