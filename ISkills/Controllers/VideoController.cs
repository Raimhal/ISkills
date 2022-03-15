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


        [HttpGet]
        [Route("api/videos/{id}")]
        public async Task<ActionResult<VideoDto>> GetCourse(Guid id)
            => Ok(await _videoService.GetByIdAsync(id));

        [HttpGet]
        [Route("api/videos/all")]
        public async Task<ActionResult<List<ChapterDto>>> GetChaptersAll(string query = "",
            string sortOption = "title", bool reverse = false)
            => Ok(await _videoService.GetListAll(query, sortOption, reverse));


        [HttpGet]
        [Route("api/videos")]
        public async Task<ActionResult<List<ChapterDto>>> GetChapters(int skip = 0, int take = 10,
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _videoService.GetList(skip, take, query, sortOption, reverse));


        [HttpGet]
        [Route("api/chapters/{id}/videos/all")]
        public async Task<ActionResult<List<ChapterDto>>> GetCourseChaptersAll(Guid id, string query = "",
            string sortOption = "title", bool reverse = false)
            => Ok(await _videoService.GetParentItemsAll(id, query, sortOption, reverse));


        [HttpGet]
        [Route("api/chapters/{id}/videos")]
        public async Task<ActionResult<List<ChapterDto>>> GetCourseChapters(Guid id, int skip = 0, int take = 10,
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _videoService.GetParentItems(id, skip, take, query, sortOption, reverse));

        [Authorize]
        [HttpPost]
        [Route("api/videos")]
        public async Task<ActionResult<Guid>> CreateCourseComment([FromForm] CreateVideoDto model,
            CancellationToken cancellationToken)
            => Ok(await _videoService.CreateAsync(model, cancellationToken));


        [Authorize]
        [HttpPut]
        [Route("api/videos/{id}")]
        public async Task<IActionResult> UpdateComment(Guid id, [FromForm] CreateVideoDto model,
            CancellationToken cancellationToken)
        {
            await _videoService.UpdateAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpPatch]
        [Route("api/videos/{id}")]
        public async Task<IActionResult> UpdateComment(Guid id, [FromBody] UpdateVideoDto model,
            CancellationToken cancellationToken)
        {
            await _videoService.PatchAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpDelete]
        [Route("api/videos/{id}")]
        public async Task<IActionResult> DeleteCourse(Guid id, CancellationToken cancellationToken)
        {
            await _videoService.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }

    }
}
