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
    public class ChapterController : BaseController
    {
        private readonly IChapterService _chapterService;
        private readonly IAccessService _accessService;

        public ChapterController(IChapterService chapterService, IAccessService accessService) => 
            (_chapterService, _accessService) = (chapterService, accessService);


        [HttpGet]
        [Route("api/chapters/{id}")]
        public async Task<ActionResult<ChapterDto>> GetCourse(Guid id, CancellationToken cancellationToken)
            => Ok(await _chapterService.GetByIdAsync(id, cancellationToken));


        [HttpGet]
        [Route("api/chapters/all")]
        public async Task<ActionResult<List<ChapterDto>>> GetChaptersAll(CancellationToken cancellationToken,
            string query = "", string sortOption = "title", bool reverse = false, Guid? courseId = null)
            => Ok(await _chapterService.GetListAll(query, sortOption, reverse, cancellationToken, courseId));


        [HttpGet]
        [Route("api/chapters")]
        public async Task<ActionResult<List<ChapterDto>>> GetChapters(CancellationToken cancellationToken, 
            int skip = 0, int take = 10, string query = "", string sortOption = "title", bool reverse = false, Guid? courseId = null)
        {
            var content = await _chapterService.GetList(skip, take, query, sortOption, reverse, cancellationToken, courseId);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }


        [Authorize]
        [HttpPost]
        [Route("api/chapters")]
        public async Task<ActionResult<Guid>> CreateChapter([FromBody] CreateChapterDto model,
            CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToCourse(UserId, model.CourseId, cancellationToken))
                return Forbid();

            return Ok(await _chapterService.CreateAsync(model, cancellationToken));
        }


        [Authorize]
        [HttpPut]
        [Route("api/chapters/{id}")]
        public async Task<IActionResult> UpdateChapter(Guid id, [FromBody] CreateChapterDto model,
            CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToChapter(UserId, id, cancellationToken))
                return Forbid();

            await _chapterService.UpdateAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpDelete]
        [Route("api/chapters/{id}")]
        public async Task<IActionResult> DeleteChapter(Guid id, CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToChapter(UserId, id, cancellationToken))
                return Forbid();

            await _chapterService.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }

    }
}
