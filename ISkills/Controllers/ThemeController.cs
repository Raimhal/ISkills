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
    public class ThemeController : BaseController
    {
        private readonly IThemeService _themeService;

        public ThemeController(IThemeService themeService) =>
            (_themeService) = (themeService);


        [HttpGet]
        [Route("api/themes/all")]
        public async Task<ActionResult<List<ThemeDto>>> GetThemes(string query = "",
            string sortOption = "title", bool reverse = false)
            => Ok(await _themeService.GetListAll(query, sortOption, reverse));


        [HttpGet]
        [Route("api/themes")]
        public async Task<ActionResult<List<ThemeDto>>> GetThemes(int skip = 0, int take = 10,
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _themeService.GetList(skip, take, query, sortOption, reverse));


        [HttpGet]
        [Route("api/themes/{id}")]
        public async Task<ActionResult<ThemeDto>> GetTheme(int id)
            => Ok(await _themeService.GetByIdAsync(id));


        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("api/themes")]
        public async Task<ActionResult<Guid>> CreateTheme([FromBody] CreateThemeDto model,
            CancellationToken cancellationToken)
            => Ok(await _themeService.CreateAsync(model, cancellationToken));


        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("api/themes/{id}")]
        public async Task<IActionResult> UpdateTheme(int id, [FromBody] CreateThemeDto model,
            CancellationToken cancellationToken)
        {
            await _themeService.UpdateAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("api/themes/{id}")]
        public async Task<IActionResult> DeleteTheme(int id, CancellationToken cancellationToken)
        {
            await _themeService.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }

    }
}
