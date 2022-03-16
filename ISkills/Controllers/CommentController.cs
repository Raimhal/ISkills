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
    public class CommentController : BaseController
    {
        private readonly ICommentService _commentService;
        private readonly IAccessService _accessService;

        public CommentController(ICommentService commentService, IAccessService accessService) => 
            (_commentService, _accessService) = (commentService, accessService);


        [HttpGet]
        [Route("api/comments/all")]
        public async Task<ActionResult<List<CommentDto>>> GetCommentsAll(CancellationToken cancellationToken, string query = "",
            string sortOption = "date", bool reverse = false)
            => Ok(await _commentService.GetListAll(query, sortOption, reverse, cancellationToken));


        [HttpGet]
        [Route("api/comments")]
        public async Task<ActionResult<List<CommentDto>>> GetComments(CancellationToken cancellationToken,
            int skip = 0, int take = 10, string query = "", string sortOption = "date", bool reverse = false)
            => Ok(await _commentService.GetList(skip, take, query, sortOption, reverse, cancellationToken));


        [HttpGet]
        [Route("api/courses/{id}/comments/all")]
        public async Task<ActionResult<List<ChapterDto>>> GetCourseCommentsAll(Guid id, CancellationToken cancellationToken,
            string query = "", string sortOption = "date", bool reverse = false)
            => Ok(await _commentService.GetParentItemsAll(id, query, sortOption, reverse, cancellationToken));


        [HttpGet]
        [Route("api/courses/{id}/comments")]
        public async Task<ActionResult<List<ChapterDto>>> GetCourseComments(Guid id, CancellationToken cancellationToken,
            int skip = 0, int take = 10, string query = "", string sortOption = "date", bool reverse = false)
            => Ok(await _commentService.GetParentItems(id, skip, take, query, sortOption, reverse, cancellationToken));


        [Authorize]
        [HttpPost]
        [Route("api/comments")]
        public async Task<ActionResult<Guid>> CreateComment([FromBody] CreateCommentDto model,
            CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToCourse(UserId, model.CourseId, cancellationToken))
                return Forbid();

            model.CreatorId = UserId;
            return Ok(await _commentService.CreateAsync(model, cancellationToken));
        }


        [Authorize]
        [HttpPut]
        [Route("api/comments/{id}")]
        public async Task<IActionResult> UpdateComment(Guid id, [FromBody] CreateCommentDto model,
            CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToComment(UserId, id, cancellationToken))
                return Forbid();

            await _commentService.UpdateAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpDelete]
        [Route("api/comments/{id}")]
        public async Task<IActionResult> DeleteC(Guid id, CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToComment(UserId, id, cancellationToken))
                return Forbid();

            await _commentService.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }

    }
}
