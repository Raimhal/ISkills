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
        public void BackupDatabase(
            string postgresqlPath = @"E:\Postgesql\bin",
            string databaseName = "ISkillsDB",
            string outputDirectoryPath = @"E:\it\Secound Course\ISkills\backend",
            string username = "postgres",
            string password = "Epidemic2021",
            string host = "127.0.0.1",
            string port = "5432")
        {
            _databaseService.BackupDatabase(postgresqlPath, outputDirectoryPath, databaseName, username, password, host, port);
            NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("api/database/restore")]
        public void RestoreDatabase(
            string postgresqlPath = @"E:\Postgesql\bin",
            string databaseName = "DumpDatabase",
            string inputFilePath = @"E:\it\Secound Course\ISkills\backend\ISkillsDb_backup.sql",
            string username = "postgres",
            string password = "Epidemic2021",
            string host = "127.0.0.1",
            string port = "5432")
        {
            _databaseService.RestoreDatabase(postgresqlPath, inputFilePath, databaseName, username, password, host, port);
            NoContent();
        }

    }
}
