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
        public void BackupDatabase(string databaseString, string postgresqlPath, string outputDirectoryPath)
        {
            if (!Directory.Exists(outputDirectoryPath))
                Directory.CreateDirectory(outputDirectoryPath);
            var date = DateTime.UtcNow;

            var outputFileFullPath = Path.Combine(outputDirectoryPath, $"Backup_{date}.bak");
            var command = $@"pg_dump -d {databaseString} > ""{outputFileFullPath}""";
            DatabaseAction(postgresqlPath, command);
        }

        public void RestoreDatabase(string databaseString, string postgresqlPath, string inputFilePath)
        {
            var command = $@"psql -d {databaseString} < ""{inputFilePath}""";
            DatabaseAction(postgresqlPath, command);
        }

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
