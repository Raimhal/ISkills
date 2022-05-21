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

    }
}
