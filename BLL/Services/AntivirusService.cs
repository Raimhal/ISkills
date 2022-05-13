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

namespace BLL.Services
{

    public class AntivirusService : IAntivirusService
    {
        private readonly ILogger<AntivirusService> _logger;
        private readonly IConfiguration _configuration;

        public AntivirusService(ILogger<AntivirusService> logger, IConfiguration configuration) =>
            (_logger, _configuration) = (logger, configuration);

        public async Task CheckFile(IFormFile file)
        {
            _logger.LogInformation("ClamAV scan begin for file {0}", file.FileName);

            await using var stream = new MemoryStream();
            await file.OpenReadStream().CopyToAsync(stream);

            try
            {
                var scanResult = await new ClamClient(
                    _configuration["ClamAVServer:URL"],
                    Convert.ToInt32(_configuration["ClamAVServer:Port"]))
                    .SendAndScanFileAsync(stream);

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
        }
    }
}
