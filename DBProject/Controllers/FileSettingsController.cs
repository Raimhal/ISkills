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
        [Route("api/file-settings/types")]
        [Authorize]
        public async Task<ActionResult<List<AllowedFileType>>> GetFileTypes()
        {
            var allowedFileTypes = await _fileSettingsService.GetAllowedFileTypes();
            return Ok(allowedFileTypes);
        }


        [HttpPost]
        [Route("api/file-settings/types/add")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<int>> AddFileType([FromBody] AllowedFileTypeDto fileTypeDto,
            CancellationToken cancellationToken)
        {
            var fileTypeId = await _fileSettingsService
                .AddFileType(fileTypeDto, cancellationToken);
            if (fileTypeId == default) 
                return Ok(new { message = $"The file type '{fileTypeDto.FileType}' already exists" });
            return Ok(fileTypeId);

        }

        [HttpDelete]
        [Route("api/file-settings/types/{id}/delete")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFileType(int id, CancellationToken cancellationToken)
        {
            await _fileSettingsService.DeleteFileType(id, cancellationToken);
            return NoContent();
        }
    }
}
