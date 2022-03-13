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
    public class CourseController : BaseController
    {
        private readonly ICourseService _courseService;
        private readonly IAccessService _accessService;

        public CourseController(ICourseService courseService, IAccessService accessService) => 
            (_courseService, _accessService) = (courseService, accessService);


        [HttpGet]
        [Route("api/courses/all")]
        public async Task<ActionResult<List<CourseDto>>> GetCourses(string query = "",
            string sortOption = "title", bool reverse = false)
            => Ok(await _courseService.GetListAll(query, sortOption, reverse));
        

        [HttpGet]
        [Route("api/courses")]
        public async Task<ActionResult<List<CourseDto>>> GetCourses(int skip = 0, int take = 10,
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _courseService.GetList(skip, take, query, sortOption, reverse));
        

        [HttpGet]
        [Route("api/courses/{id}")]
        public async Task<ActionResult<CourseDto>> GetCourse(Guid id)
            => Ok(await _courseService.GetByIdAsync(id));
        

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
            if (await _accessService.HasAccessToCourse(UserId, id))
            {
                await _courseService.UpdateAsync(id, model, cancellationToken);
                return NoContent();
            }
            return StatusCode(403);
        }


        [Authorize]
        [HttpPatch]
        [Route("api/courses/{id}")]
        public async Task<IActionResult> ToggleUserAssignment(Guid id, CancellationToken cancellationToken)
        {
            await _courseService.ToggleUserAssignment(UserId, id, cancellationToken);
            return NoContent();
        }


        [Authorize]
        [HttpDelete]
        [Route("api/couses/{id}")]
        public async Task<IActionResult> DeleteCourse(Guid id, CancellationToken cancellationToken)
        {
            if (await _accessService.HasAccessToCourse(UserId, id))
            {
                await _courseService.DeleteByIdAsync(id, cancellationToken);
                return NoContent();
            }
            return StatusCode(403);
        }

    }
}
