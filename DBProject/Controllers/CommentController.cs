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
        public async Task<ActionResult<List<CommentDto>>> GetCourses(string query = "",
            string sortOption = "title", bool reverse = false)
            => Ok(await _commentService.GetListAll(query, sortOption, reverse));


        [HttpGet]
        [Route("api/comments")]
        public async Task<ActionResult<List<CourseDto>>> GetCourses(int skip = 0, int take = 10,
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _commentService.GetList(skip, take, query, sortOption, reverse));


        [Authorize]
        [HttpPost]
        [Route("api/comments")]
        public async Task<ActionResult<Guid>> CreateCourseComment([FromBody] CreateCommentDto model,
            CancellationToken cancellationToken)
        {
            model.CreatorId = UserId;
            return Ok(await _commentService.CreateAsync(model, cancellationToken));
        }


        [Authorize]
        [HttpPut]
        [Route("api/comments/{id}")]
        public async Task<IActionResult> UpdateComment(Guid id, [FromBody] CreateCommentDto model,
            CancellationToken cancellationToken)
        {
            if (await _accessService.HasAccessToComment(UserId, id))
            {
                await _commentService.UpdateAsync(id, model, cancellationToken);
                return NoContent();
            }
            return StatusCode(403);
        }


        [Authorize]
        [HttpDelete]
        [Route("api/comments/{id}")]
        public async Task<IActionResult> DeleteCourse(Guid id, CancellationToken cancellationToken)
        {
            if (await _accessService.HasAccessToComment(UserId, id))
            {
                await _commentService.DeleteByIdAsync(id, cancellationToken);
                return NoContent();
            }
            return StatusCode(403);

        }

    }
}
