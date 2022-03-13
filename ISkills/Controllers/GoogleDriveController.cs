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
    public class GoogleDriveController : BaseController
    {
        private readonly IGoogleDriveService _driveService;

        public GoogleDriveController(IGoogleDriveService driveService) =>
            (_driveService) = (driveService);

        [HttpGet]
        [Route("api/google")]
        public IActionResult GetGoogleDriveFiles() {
            _driveService.Main();
            return Ok();
        }

        //[HttpGet]
        //[Route("api/categories/all")]
        //public async Task<ActionResult<List<CategoryDto>>> GetCategorys(string query = "",
        //    string sortOption = "title", bool reverse = false)
        //    => Ok(await _categoryService.GetListAll(query, sortOption, reverse));
        

        //[HttpGet]
        //[Route("api/categories")]
        //public async Task<ActionResult<List<CategoryDto>>> GetCategorys(int skip = 0, int take = 10,
        //    string query = "", string sortOption = "title", bool reverse = false)
        //    => Ok(await _categoryService.GetList(skip, take, query, sortOption, reverse));
        

        //[HttpGet]
        //[Route("api/categories/{id}")]
        //public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        //    => Ok(await _categoryService.GetByIdAsync(id));
        

        //[Authorize(Roles="Admin")]
        //[HttpPost]
        //[Route("api/categories")]
        //public async Task<ActionResult<Guid>> CreateCategory([FromBody] CreateCategoryDto model,
        //    CancellationToken cancellationToken)
        //    => Ok(await _categoryService.CreateAsync(model, cancellationToken));


        //[Authorize(Roles = "Admin")]
        //[HttpPut]
        //[Route("api/categories/{id}/update")]
        //public async Task<IActionResult> UpdateCategory(int id, [FromBody] CreateCategoryDto model,
        //    CancellationToken cancellationToken)
        //{
        //    await _categoryService.UpdateAsync(id, model, cancellationToken);
        //    return NoContent();
        //}


        //[Authorize(Roles ="Admin")]
        //[HttpDelete]
        //[Route("api/categories/{id}/delete")]
        //public async Task<IActionResult> DeleteCategory(int id, CancellationToken cancellationToken)
        //{
        //    await _categoryService.DeleteByIdAsync(id, cancellationToken);
        //    return NoContent();
        //}

    }
}
