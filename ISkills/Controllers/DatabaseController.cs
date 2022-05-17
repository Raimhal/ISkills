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
        public void BackupDatabase(string outputDirectoryPath = @"E:\it\Secound Course\ISkills\backend")
        {
            string postgresPath = Environment.GetEnvironmentVariable("PG_PATH") ?? @"E:\Postgesql\bin";
            string database = Environment.GetEnvironmentVariable("DATABASE_URL");
            _databaseService.BackupDatabase(outputDirectoryPath, postgresPath, database);
            NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("api/database/restore")]
        public void RestoreDatabase(string inputFilePath)
        {
            string postgresPath = Environment.GetEnvironmentVariable("PG_PATH");
            string database = Environment.GetEnvironmentVariable("DATABASE_URL");
            _databaseService.RestoreDatabase(inputFilePath, postgresPath, database);
            NoContent();
        }

    }
}
