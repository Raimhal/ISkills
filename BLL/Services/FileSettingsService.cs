using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using nClam;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using BLL.Validation.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using System.Linq.Expressions;

namespace BLL.Services
{
    public class FileSettingsService : IFileSettingsService
    {
        private readonly IAllowedFileTypeDbContext _fileTypesContext;
        private readonly IMapper _mapper;
        private readonly ILogger<FileSettingsService> _logger;
        private readonly IConfiguration _configuration;

        public FileSettingsService(IAllowedFileTypeDbContext fileTypesContext,
            IMapper mapper, ILogger<FileSettingsService> logger, IConfiguration configuration) =>
            (_fileTypesContext, _mapper, _logger, _configuration) 
            = (fileTypesContext, mapper, logger, configuration);


        public async Task<List<AllowedFileType>> GetAllowedFileTypes()
        {
            return await _fileTypesContext.AllowedFileTypes
               .ToListAsync();

        }

        public async Task<int> AddFileType(AllowedFileTypeDto fileTypeDto, CancellationToken cancellationToken)
        {
            var fileType = await _fileTypesContext.AllowedFileTypes
                .FirstOrDefaultAsync(t =>
                t.FileType == fileTypeDto.FileType, cancellationToken);

            if (fileType != null) return default;

            var type = _mapper.Map<AllowedFileType>(fileTypeDto);
            _fileTypesContext.AllowedFileTypes.Add(type);

            await _fileTypesContext.SaveChangesAsync(cancellationToken);
            return type.Id;
        }

       

        public async Task DeleteFileType(int id, CancellationToken cancellationToken)
        {
            Expression<Func<AllowedFileType, bool>> expression = t => t.Id == id;
            var type = await _fileTypesContext.AllowedFileTypes
                .FirstOrDefaultAsync(expression, cancellationToken);

            if (type == null)
                throw new NotFoundException(nameof(AllowedFileType), id);

            _fileTypesContext.AllowedFileTypes.Remove(type);
            await _fileTypesContext.SaveChangesAsync(cancellationToken);
        }

        

        // antivirus
        private async Task<byte[]> CheckFile(IFormFile file, byte[] fileBytes)
        {
            try
            {
                _logger.LogInformation("ClamAV scan begin for file {0}", file.FileName);
                var clam = new ClamClient(_configuration["ClamAVServer:URL"],
                                          Convert.ToInt32(_configuration["ClamAVServer:Port"]));
                var scanResult = await clam.SendAndScanFileAsync(fileBytes);
                switch (scanResult.Result)
                {
                    case ClamScanResults.Clean:
                        _logger.LogInformation($"The file is clean! ScanResult:{scanResult.RawResult}");
                        break;
                    case ClamScanResults.VirusDetected:
                        _logger.LogError($"Virus Found! Virus name: {scanResult.InfectedFiles.FirstOrDefault().VirusName}");
                        break;
                    case ClamScanResults.Error:
                        _logger.LogError($"An error occured while scaning the file! ScanResult: {scanResult.RawResult}");
                        break;
                    case ClamScanResults.Unknown:
                        _logger.LogError($"Unknown scan result while scaning the file! ScanResult: {scanResult.RawResult}");
                        break;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"ClamAV Scan Exception: {ex}");
            }
            _logger.LogInformation($"ClamAV scan completed for file {file.FileName}");

            return fileBytes;
        }

        private async Task<bool> IsValidFile(string extension, long fileSize)
        {
            Expression<Func<AllowedFileType, bool>> expression = t => t.FileType == extension;
            var type = await _fileTypesContext.AllowedFileTypes
                .FirstOrDefaultAsync(expression);

            if (type == null)
                throw new NotFoundException(nameof(AllowedFileType), extension);

            return (fileSize / Math.Pow(10, 6)) <= type.FileSize;
        }
    }
}


