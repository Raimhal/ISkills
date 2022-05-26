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
    public class CategoryController : BaseController
    {
        private readonly ICategoryRepository _categoryService;

        public CategoryController(ICategoryRepository categoryService) =>
            (_categoryService) = ( categoryService);


        [HttpGet]
        [Route("api/categories/all")]
        public async Task<ActionResult<List<CategoryDto>>> GetCategoriesAll(CancellationToken cancellationToken,
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _categoryService.GetListAll(query, sortOption, reverse, cancellationToken));
        

        [HttpGet]
        [Route("api/categories")]
        public async Task<ActionResult<List<CategoryDto>>> GetCategoryies(CancellationToken cancellationToken,
            int skip = 0, int take = 10, string query = "", string sortOption = "title", bool reverse = false)
        {
            var content = await _categoryService.GetList(skip, take, query, sortOption, reverse, cancellationToken);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }
        

        [HttpGet]
        [Route("api/categories/{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id, CancellationToken cancellationToken)
            => Ok(await _categoryService.GetByIdAsync(id, cancellationToken));
        

        [Authorize(Roles="Admin")]
        [HttpPost]
        [Route("api/categories")]
        public async Task<ActionResult<Guid>> CreateCategory([FromBody] CreateCategoryDto model,
            CancellationToken cancellationToken)
            => Ok(await _categoryService.CreateAsync(model, cancellationToken));


        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("api/categories/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CreateCategoryDto model,
            CancellationToken cancellationToken)
        {
            await _categoryService.UpdateAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("api/categories/{id}")]
        public async Task<IActionResult> DeleteCategory(int id, CancellationToken cancellationToken)
        {
            await _categoryService.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }
    }
}
