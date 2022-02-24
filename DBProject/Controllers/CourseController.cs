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
            (_courseService, _accessService) = ( courseService, accessService);


        [HttpGet]
        [Route("api/courses/all")]
        public async Task<ActionResult<List<CourseDto>>> GetCourses()
        {
            var courses = await _courseService.GetAll();
            return Ok(courses);
        }

        [HttpGet]
        [Route("api/courses")]
        public async Task<ActionResult<List<CourseDto>>> GetCourses(int skip = 0, int take = 10, string query = "", string sortOption = "title", bool reverse = false)
        {
            var courses = await _courseService.GetAll(skip, take, query, sortOption, reverse);
            return Ok(courses);
        }

        [HttpGet]
        [Route("api/courses/{id}")]
        public async Task<ActionResult<CourseDto>> GetCourse(Guid id)
        {
            var course = await _courseService.GetByIdAsync(id);
            return Ok(course);
        }

        [Authorize]
        [HttpPost]
        [Route("api/courses")]
        public async Task<ActionResult<Guid>> CreateUser([FromBody] CreateCourseDto model,
            CancellationToken cancellationToken)
        {
            model.CreatorId = UserId;
            var course = await _courseService.CreateAsync(model, cancellationToken);
            return Ok(course);
        }

        [Authorize]
        [HttpPut]
        [Route("api/courses/{id}/update")]
        public async Task<IActionResult> UpdateCourse(Guid id, [FromBody] CreateCourseDto model,
            CancellationToken cancellationToken)
        {
            if (await _accessService.HasAccessToCourse(UserId, id))
            {
                await _courseService.UpdateAsync(id, model, cancellationToken);
                return NoContent();
            }
            return StatusCode(401);
        }


        //[Authorize(Roles = "Admin")]
        //[HttpDelete]
        //[Route("api/users/{id}/delete")]
        //public async Task<IActionResult> DeleteUser(Guid id, CancellationToken cancellationToken)
        //{
        //    await _userService.DeleteByIdAsync(id, cancellationToken);
        //    return NoContent();

        //}

    }
}
