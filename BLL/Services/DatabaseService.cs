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
using System.Net;
using BLL.DtoModels;

namespace BLL.Services
{

    public class DatabaseService : IDatabaseService
    {
        private readonly ICloudinaryService _cloudinaryService;

        public DatabaseService(ICloudinaryService cloudinaryService)
        {
            _cloudinaryService = cloudinaryService;
        }

        public async Task<PaginationList<CloudinarySearchResourceDto>> GetBackups(int skip, int take)
        {
            return await _cloudinaryService.GetFilesLinks("format:sql", skip, take);
        }

        public async Task<string> BackupDatabase(string databaseString, string postgresqlPath)
        {
            var date = DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss");

            var directory = GetBackupDirectory();
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            var outputFileFullPath = Path.Combine(directory, $@"Backup_{date}.sql");

            var command = $@"pg_dump -c -d {databaseString} > ""{outputFileFullPath}""";
            DatabaseAction(postgresqlPath, command);

            using var stream = File.OpenRead(outputFileFullPath);
            var file = new FormFile(stream, 0, stream.Length, null, Path.GetFileName(stream.Name))
            {
                Headers = new HeaderDictionary(),
                ContentType = "application/octet-stream"
            };
            return await _cloudinaryService.UploadFileAsync(file, file.FileName);
        }

        public void RestoreDatabase(string databaseString, string postgresqlPath, string backupUrl)
        {
            var directory = GetBackupDirectory();
            var fileName = backupUrl.Split('/').Last();
            var filePath = Path.Combine(directory, fileName);
            if (!File.Exists(filePath))
            {
                var webClient = new WebClient();
                webClient.DownloadFileAsync(new Uri(backupUrl), filePath);
            }
            var command = $@"psql -d {databaseString} < ""{filePath}""";
            DatabaseAction(postgresqlPath, command);
        }

        private static void DatabaseAction(string postgresqlPath, string command)
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

        private static string GetBackupDirectory() => Path.Combine(Environment.CurrentDirectory, "Backups");
    }
}
