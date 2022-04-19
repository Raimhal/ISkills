using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using BLL.Interfaces;
using Domain.Interfaces;
using Domain.Models;
using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Http;
using nClam;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Diagnostics;

namespace BLL.Services
{

    public class DatabaseService : IDatabaseService
    {
        public void BackupDatabase(string postgresqlPath, string outputDirectoryPath, string databaseName, string username, string password, string host, string port)
        {
            if (!Directory.Exists(outputDirectoryPath))
                Directory.CreateDirectory(outputDirectoryPath);

            var databaseString = GetDatabaseString(databaseName, username, password, host, port);
            var outputFileFullPath = Path.Combine(outputDirectoryPath, $"{databaseName}_backup.sql");
            var command = $@"pg_dump {databaseString} > ""{outputFileFullPath}""";
            DatabaseAction(postgresqlPath, command);
        }

        public void RestoreDatabase(string postgresqlPath, string inputFilePath, string databaseName, string username, string password, string host, string port)
        {
            var databaseString = GetDatabaseString(databaseName, username, password, host, port);
            var command = $@"psql {databaseString} < ""{inputFilePath}""";
            DatabaseAction(postgresqlPath, command);
        }

        private string GetDatabaseString(string databaseName, string username, string password, string host, string port)
            => $"-d postgresql://{username}:{password}@{host}:{port}/{databaseName}";

        private void DatabaseAction(string postgresqlPath, string command)
        {
            var process = new Process();

            process.StartInfo.FileName = "cmd.exe";
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.RedirectStandardInput = true;
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.CreateNoWindow = false;
            process.StartInfo.Arguments = $"/C cd {postgresqlPath} & {command}";

            process.Start();
            process.WaitForExit();
            process.Close();
        }
    }
}
