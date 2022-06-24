using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using System.Collections.Generic;
using Domain.Models;
using Microsoft.AspNetCore.Http;
using ISkills.Controllers;

namespace Iskills.Controllers
{
    [ApiController]
    public class DatabaseController : BaseController
    {
        private readonly IDatabaseService _databaseService;

        public DatabaseController(IDatabaseService databaseService) =>
            _databaseService = databaseService;

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("api/database/backups")]
        public async Task<ActionResult<List<CloudinarySearchResourceDto>>> GetBackups(int skip = 0, int take = 10)
        {
            var content = await _databaseService.GetBackups(skip, take);
            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("api/database/backup")]
        public async Task<ActionResult<string>> BackupDatabase()
        {
            string postgresPath = Environment.GetEnvironmentVariable("PG_PATH");
            string database = Environment.GetEnvironmentVariable("DATABASE_URL");
            return Ok(await _databaseService.BackupDatabase(database, postgresPath));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("api/database/restore")]
        public IActionResult RestoreDatabase(string backupUrl)
        {
            string postgresPath = Environment.GetEnvironmentVariable("PG_PATH");
            string database = Environment.GetEnvironmentVariable("DATABASE_URL");
            _databaseService.RestoreDatabase(database, postgresPath, backupUrl);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("api/database/backup")]
        public async Task<IActionResult> DeleteBackup(string backupUrl)
        {
            await _databaseService.DeleteBackup(backupUrl);
            return NoContent();
        }

    }
}
