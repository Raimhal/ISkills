using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using System.Collections.Generic;
using Domain.Models;

namespace ISkills.Controllers
{
    [ApiController]
    public class CommentController : BaseController
    {
        private readonly ICommentRepository _commentService;
        private readonly IAccessRepository _accessService;

        public CommentController(ICommentRepository commentService, IAccessRepository accessService) => 
            (_commentService, _accessService) = (commentService, accessService);


        [HttpGet]
        [Route("api/comments/all")]
        public async Task<ActionResult<List<CommentDto>>> GetCommentsAll(CancellationToken cancellationToken = default, string query = "",
            string sortOption = "date", bool reverse = false, Guid? courseId = null)
            => Ok(await _commentService.GetListAll(query, sortOption, reverse, cancellationToken, courseId));


        [HttpGet]
        [Route("api/comments")]
        public async Task<ActionResult<List<CommentDto>>> GetComments(CancellationToken cancellationToken = default,
            int skip = 0, int take = 10, string query = "", string sortOption = "date", bool reverse = false, Guid? courseId = null)
        {
            var content = await _commentService.GetList(skip, take, query, sortOption, reverse, cancellationToken, courseId);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }


        [HttpGet]
        [Route("api/comments/{id}")]
        public async Task<ActionResult<Comment>> GetCourse(Guid id, CancellationToken cancellationToken = default)
            => Ok(await _commentService.GetByIdAsync(id, cancellationToken));


        [Authorize]
        [HttpPost]
        [Route("api/comments")]
        public async Task<ActionResult<Guid>> CreateComment([FromBody] CreateCommentDto model,
            CancellationToken cancellationToken = default)
        {
            if (!await _accessService.HasAccessToCreateComment(UserId, model.CourseId, cancellationToken))
                return Forbid();

            model.CreatorId = UserId;
            return Ok(await _commentService.CreateAsync(model, cancellationToken));
        }


        [Authorize]
        [HttpPut]
        [Route("api/comments/{id}")]
        public async Task<IActionResult> UpdateComment(Guid id, [FromBody] CreateCommentDto model,
            CancellationToken cancellationToken = default)
        {
            if (!await _accessService.HasAccessToComment(UserId, id, cancellationToken))
                return Forbid();

            await _commentService.UpdateAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpDelete]
        [Route("api/comments/{id}")]
        public async Task<IActionResult> DeleteC(Guid id, CancellationToken cancellationToken = default)
        {
            if (!await _accessService.HasAccessToComment(UserId, id, cancellationToken))
                return Forbid();

            await _commentService.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }
    }
}
