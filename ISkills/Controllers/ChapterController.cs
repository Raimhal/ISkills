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
    public class ChapterController : BaseController
    {
        private readonly IChapterService _chapterService;
        private readonly IAccessService _accessService;

        public ChapterController(IChapterService chapterService, IAccessService accessService) => 
            (_chapterService, _accessService) = (chapterService, accessService);


        [HttpGet]
        [Route("api/chapters/all")]
        public async Task<ActionResult<List<ChapterDto>>> GetChaptersAll(string query = "",
            string sortOption = "title", bool reverse = false)
            => Ok(await _chapterService.GetListAll(query, sortOption, reverse));


        [HttpGet]
        [Route("api/chapters")]
        public async Task<ActionResult<List<ChapterDto>>> GetChapters(int skip = 0, int take = 10,
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _chapterService.GetList(skip, take, query, sortOption, reverse));


        [HttpGet]
        [Route("api/courses/{id}/chapters/all")]
        public async Task<ActionResult<List<ChapterDto>>> GetCourseChaptersAll(Guid id, string query = "",
            string sortOption = "title", bool reverse = false)
            => Ok(await _chapterService.GetCourseCommentsAll(id, query, sortOption, reverse));


        [HttpGet]
        [Route("api/courses/{id}/chapters")]
        public async Task<ActionResult<List<ChapterDto>>> GetCourseChapters(Guid id, int skip = 0, int take = 10,
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _chapterService.GetCourseComments(id, skip, take, query, sortOption, reverse));


        [Authorize]
        [HttpPost]
        [Route("api/chapters")]
        public async Task<ActionResult<Guid>> CreateCourseComment([FromBody] CreateChapterDto model,
            CancellationToken cancellationToken)
        {
            return Ok(await _chapterService.CreateAsync(model, cancellationToken));
        }


        [Authorize]
        [HttpPut]
        [Route("api/chapters/{id}")]
        public async Task<IActionResult> UpdateComment(Guid id, [FromBody] CreateChapterDto model,
            CancellationToken cancellationToken)
        {
            if (await _accessService.HasAccessToComment(UserId, id))
            {
                await _chapterService.UpdateAsync(id, model, cancellationToken);
                return NoContent();
            }
            return StatusCode(403);
        }


        [Authorize]
        [HttpDelete]
        [Route("api/chapters/{id}")]
        public async Task<IActionResult> DeleteCourse(Guid id, CancellationToken cancellationToken)
        {
            if (await _accessService.HasAccessToComment(UserId, id))
            {
                await _chapterService.DeleteByIdAsync(id, cancellationToken);
                return NoContent();
            }
            return StatusCode(403);

        }

    }
}
