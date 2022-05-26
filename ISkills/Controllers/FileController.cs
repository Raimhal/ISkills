using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using Domain.Models;
using System.Collections.Generic;

namespace ISkills.Controllers
{

    public class FileController : BaseController
    {
        private readonly IFileRepository _fileService;

        public FileController(IFileRepository fileService) =>
            _fileService = fileService;


        [HttpGet]
        [Route("api/file-types/all")]
        public async Task<ActionResult<List<AllowedFileTypeDto>>> GetFileTypesAll(CancellationToken cancellationToken, 
            string query = "", string sortOption = "filetype", bool reverse = false)
            => Ok(await _fileService.GetListAll(query, sortOption, reverse, cancellationToken));


        [HttpGet]
        [Route("api/file-types")]
        public async Task<ActionResult<List<AllowedFileTypeDto>>> GetFileTypes(CancellationToken cancellationToken, 
            int skip = 0, int take = 10, string query = "", string sortOption = "filetype", bool reverse = false)
        {
            var content = await _fileService.GetList(skip, take, query, sortOption, reverse, cancellationToken);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }


        [HttpGet]
        [Route("api/file-types/{id}")]
        public async Task<ActionResult<AllowedFileType>> GetCourse(int id, CancellationToken cancellationToken)
            => Ok(await _fileService.GetByIdAsync(id, cancellationToken));


        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("api/file-types")]
        public async Task<ActionResult<int>> CreateFileType([FromBody] CreateAllowedFileTypeDto fileTypeDto,
            CancellationToken cancellationToken)
            => Ok(await _fileService.CreateAsync(fileTypeDto, cancellationToken));


        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("api/file-types/{id}")]
        public async Task<IActionResult> UpdateFileType(int id, [FromBody] CreateAllowedFileTypeDto model,
            CancellationToken cancellationToken)
        {
            await _fileService.UpdateAsync(id, model, cancellationToken);
            return NoContent();
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("api/file-types/{id}")]
        public async Task<IActionResult> DeleteFileType(int id, CancellationToken cancellationToken)
        {
            await _fileService.DeleteByIdAsync(id, cancellationToken);
            return NoContent();
        }
    }
}
