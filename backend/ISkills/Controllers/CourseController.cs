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
        private readonly IAccessService _accessService;

        public CourseController(ICourseService courseService, IAccessService accessService) => 
            (_courseService, _accessService) = (courseService, accessService);


        [HttpGet]
        [Route("api/courses/all")]
        public async Task<ActionResult<List<CourseDto>>> GetCoursesAll(CancellationToken cancellationToken,
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _courseService.GetListAll(query, sortOption, reverse, cancellationToken));


        [HttpGet]
        [Route("api/courses")]
        public async Task<ActionResult<List<CourseDto>>> GetCourses(CancellationToken cancellationToken,
            int skip = 0, int take = 10, string query = "", string sortOption = "title", bool reverse = false)
        {
            var content = await _courseService.GetList(skip, take, query, sortOption, reverse, cancellationToken);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }


        [Authorize]
        [HttpGet]
        [Route("api/courses/my-all")]
        public async Task<ActionResult<List<CourseDto>>> GetMyCoursesAll(CancellationToken cancellationToken,
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _courseService.GetParentItemsAll(UserId, query, sortOption, reverse, cancellationToken));


        [Authorize]
        [HttpGet]
        [Route("api/courses/my")]
        public async Task<ActionResult<List<CourseDto>>> GetMyCourses(CancellationToken cancellationToken,
            int skip = 0, int take = 10, string query = "", string sortOption = "title", bool reverse = false)
        {
            var content = await _courseService.GetParentItems(UserId, skip, take, query, sortOption, reverse, cancellationToken);
            Response.Headers.Add("x-total-count", content.TotalCount.ToString());
            return Ok(content.List);
        }


        [HttpGet]
        [Route("api/themes/{id}/courses/all")]
        public async Task<ActionResult<List<CourseDto>>> GetThemeCoursesAll(int id, CancellationToken cancellationToken,
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _courseService.GetParentItemsAll(id, query, sortOption, reverse, cancellationToken));


        [HttpGet]
        [Route("api/themes/{id}/courses")]
        public async Task<ActionResult<List<CourseDto>>> GetThemeCourses(int id, CancellationToken cancellationToken,
            int skip = 0, int take = 10, string query = "", string sortOption = "title", bool reverse = false)
        {
            var content = await _courseService.GetParentItems(id, skip, take, query, sortOption, reverse, cancellationToken);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
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
        public async Task<IActionResult> UpdateImage(Guid id, [FromForm] IFormFile file,
            CancellationToken cancellationToken, int width = 128, int height = 128)
        {
            if (!await _accessService.HasAccessToUser(UserId, id, cancellationToken))
                return Forbid();

            await _courseService.UpdateImageAsync(id, file, width, height, cancellationToken);
            return NoContent();
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
