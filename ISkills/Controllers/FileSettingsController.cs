using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using Domain.Models;
using System.Collections.Generic;

namespace Iskills.Controllers
{

    public class FileSettingsController : BaseController
    {
        private readonly IFileSettingsService _fileSettingsService;

        public FileSettingsController(IFileSettingsService fileSettingsService) =>
            _fileSettingsService = fileSettingsService;


        [HttpGet]
        [Route("api/file-types/all")]
        public async Task<ActionResult<List<CreateAllowedFileTypeDto>>> GetFileTypesAll(string query = "",
            string sortOption = "title", bool reverse = false)
            => Ok(await _fileSettingsService.GetListAll(query, sortOption, reverse));


        [HttpGet]
        [Route("api/file-types")]
        public async Task<ActionResult<List<CreateAllowedFileTypeDto>>> GetFileTypes(int skip = 0, int take = 10,
            string query = "", string sortOption = "title", bool reverse = false)
            => Ok(await _fileSettingsService.GetList(skip, take, query, sortOption, reverse));


        [HttpPost]
        [Route("api/file-types")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<int>> CreateFileType([FromBody] CreateAllowedFileTypeDto fileTypeDto,
            CancellationToken cancellationToken)
            => Ok(await _fileSettingsService.CreateAsync(fileTypeDto, cancellationToken));


        [HttpPut]
        [Route("api/file-types/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateFileType(int id, [FromBody] CreateAllowedFileTypeDto model,
            CancellationToken cancellationToken)
        {
            await _fileSettingsService.UpdateAsync(id, model, cancellationToken);
            return NoContent();
        }


        [HttpDelete]
        [Route("api/file-types/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFileType(int id, CancellationToken cancellationToken)
        {
            await _fileSettingsService.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }
    }
}
