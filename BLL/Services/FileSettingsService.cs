using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using nClam;
using System;
using System.Collections.Generic;
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

        public async Task<AllowedFileType> GetByIdAsync(int id)
            => await LookUp.GetAsync(
                _fileTypesContext.AllowedFileTypes,
                _mapper,
                x => x.Id == id,
                null);

        public async Task<List<AllowedFileTypeDto>> GetList(int skip, int take, string query, string sortOption, bool reverse)
            => await LookUp.GetListAsync<AllowedFileType, AllowedFileTypeDto>(
                _fileTypesContext.AllowedFileTypes,
                _mapper,
                skip,
                take,
                c => c.FileType.Contains(query.ToLower().Trim()),
                sortOption,
                reverse);

        public async Task<List<AllowedFileTypeDto>> GetListAll(string query, string sortOption, bool reverse)
            => await LookUp.GetListAllAsync<AllowedFileType, AllowedFileTypeDto>(
                _fileTypesContext.AllowedFileTypes,
                _mapper,
                c => c.FileType.Contains(query.ToLower().Trim()),
                sortOption,
                reverse);

        public async Task<int> CreateAsync(CreateAllowedFileTypeDto model, CancellationToken cancellationToken)
        {
            if (await _fileTypesContext.AllowedFileTypes
                .AnyAsync(t => t.FileType == model.FileType
                , cancellationToken))
                throw new AlreadyExistsException(nameof(AllowedFileType), model.FileType);

            var type = _mapper.Map<AllowedFileType>(model);

            _fileTypesContext.AllowedFileTypes.Add(type);
            await _fileTypesContext.SaveChangesAsync(cancellationToken);

            return type.Id;
        }

        public async Task UpdateAsync(int id, CreateAllowedFileTypeDto model, CancellationToken cancellationToken)
        {
            var type = await LookUp.GetAsync<AllowedFileType>(_fileTypesContext.AllowedFileTypes,
                _mapper, t => t.Id == id, new() { });

            if (!string.IsNullOrEmpty(model.FileType) && model.FileType != type.FileType)
                if (await _fileTypesContext.AllowedFileTypes.AnyAsync(t => t.FileType == model.FileType, cancellationToken))
                    throw new AlreadyExistsException(nameof(AllowedFileType), model.FileType);
            

            type = _mapper.Map<AllowedFileType>(type);

            _fileTypesContext.AllowedFileTypes.Update(type);
            await _fileTypesContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(int id, CancellationToken cancellationToken)
        {
            await LookUp.DeleteByAsync<AllowedFileType>(_fileTypesContext.AllowedFileTypes,
                _mapper, t => t.Id == id);
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


