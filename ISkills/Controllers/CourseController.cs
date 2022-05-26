using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace ISkills.Controllers
{
    [ApiController]
    public class CourseController : BaseController
    {
        private readonly ICourseService _courseService;
        private readonly IAccessRepository _accessService;

        public CourseController(ICourseService courseService, IAccessRepository accessService) => 
            (_courseService, _accessService) = (courseService, accessService);


        [HttpGet]
        [Route("api/courses/all")]
        public async Task<ActionResult<List<CourseDto>>> GetCoursesAll(CancellationToken cancellationToken,
            string query = "", string sortOption = "title", bool reverse = false, int? themeId = null, Guid? creatorId = null)
            => Ok(await _courseService.GetListAll(query, sortOption, reverse, cancellationToken, themeId, creatorId));


        [HttpGet]
        [Route("api/courses")]
        public async Task<ActionResult<List<CourseDto>>> GetCourses(CancellationToken cancellationToken,
            int skip = 0, int take = 10, string query = "", string sortOption = "title", bool reverse = false, int? themeId = null, Guid? creatorId = null)
        {
            var content = await _courseService.GetList(skip, take, query, sortOption, reverse, cancellationToken, themeId, creatorId);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }


        [Authorize]
        [HttpGet]
        [Route("api/courses/my-all")]
        public async Task<ActionResult<List<CourseDto>>> GetMyCoursesAll(CancellationToken cancellationToken,
            string query = "", string sortOption = "title", bool reverse = false, int? themeId = null)
            => Ok(await _courseService.GetParentItemsAll(query, sortOption, reverse, cancellationToken, themeId, UserId));


        [Authorize]
        [HttpGet]
        [Route("api/courses/my")]
        public async Task<ActionResult<List<CourseDto>>> GetMyCourses(CancellationToken cancellationToken,
            int skip = 0, int take = 10, string query = "", string sortOption = "title", bool reverse = false, int? themeId = null)
        {
            var content = await _courseService.GetParentItems(skip, take, query, sortOption, reverse, cancellationToken, themeId, UserId);
            Response.Headers.Add("x-total-count", content.TotalCount.ToString());
            return Ok(content.List);
        }


        [HttpGet]
        [Route("api/courses/{id}")]
        public async Task<ActionResult<CourseDto>> GetCourse(Guid id, CancellationToken cancellationToken)
            => Ok(await _courseService.GetByIdAsync(id, cancellationToken));


        [Authorize]
        [HttpPost]
        [Route("api/courses")]
        public async Task<ActionResult<Guid>> CreateCourse([FromBody] CreateCourseDto model,
            CancellationToken cancellationToken)
        {
            model.CreatorId = UserId;
            return Ok(await _courseService.CreateAsync(model, cancellationToken));
        }


        [Authorize]
        [HttpPut]
        [Route("api/courses/{id}")]
        public async Task<IActionResult> UpdateCourse(Guid id, [FromBody] CreateCourseDto model,
            CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToCourse(UserId, id, cancellationToken))
                return Forbid();

            await _courseService.UpdateAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpPatch]
        [Route("api/courses/{id}/assignment")]
        public async Task<IActionResult> ToggleUserAssignment(Guid id, CancellationToken cancellationToken)
        {
            await _courseService.ToggleUserAssignment(UserId, id, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpPatch]
        [Route("api/courses/{id}")]
        public async Task<ActionResult<string>> UpdateImage(Guid id, [FromForm] IFormFile file,
            CancellationToken cancellationToken, int width = 256, int height = 256)
        {
            if (!await _accessService.HasAccessToCourse(UserId, id, cancellationToken))
                return Forbid();

            return Ok(await _courseService.UpdateImageAsync(id, file, width, height, cancellationToken));
        }


        [Authorize]
        [HttpDelete]
        [Route("api/courses/{id}")]
        public async Task<IActionResult> DeleteCourse(Guid id, CancellationToken cancellationToken)
        {
            if (!await _accessService.HasAccessToCourse(UserId, id, cancellationToken))
                return Forbid();
            
            await _courseService.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }

        

    }
}
