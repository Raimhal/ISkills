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
using System.IO;

namespace BLL.Services
{
    public class FileService : IFileService
    {
        private readonly IAllowedFileTypeDbContext _fileTypesContext;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public FileService(IAllowedFileTypeDbContext fileTypesContext, IMapper mapper) =>
            (_fileTypesContext, _mapper) = (fileTypesContext, mapper);

        public async Task<AllowedFileType> GetByIdAsync(int id)
            => await LookUp.GetAsync(
                _fileTypesContext.AllowedFileTypes,
                _mapper,
                x => x.Id == id,
                null);

        public async Task<List<AllowedFileTypeDto>> GetList(int skip, int take,
            string query, string sortOption, bool reverse)
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
                throw new AlreadyExistsException(nameof(AllowedFileType), nameof(model.FileType), model.FileType);

            var type = _mapper.Map<AllowedFileType>(model);

            _fileTypesContext.AllowedFileTypes.Add(type);
            await _fileTypesContext.SaveChangesAsync(cancellationToken);

            return type.Id;
        }

        public async Task UpdateAsync(int id, CreateAllowedFileTypeDto model, CancellationToken cancellationToken)
        {
            var type = await LookUp.GetAsync(_fileTypesContext.AllowedFileTypes,
                _mapper, t => t.Id == id, new() { });

            if (!string.IsNullOrEmpty(model.FileType) && model.FileType != type.FileType)
                if (await _fileTypesContext.AllowedFileTypes.AnyAsync(t => t.FileType == model.FileType, cancellationToken))
                    throw new AlreadyExistsException(nameof(AllowedFileType), nameof(model.FileType), model.FileType);
            

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

        public async Task<bool> IsValidFile(IFormFile file)
        {
            if (file?.Length > 0)
            {
                var extension = Path.GetExtension(file.FileName).Replace(".", "");
                var type = await LookUp.GetAsync(_fileTypesContext.AllowedFileTypes,
                    _mapper, t => t.FileType == extension, new() { });
                return (file.Length / Math.Pow(10, 6)) <= type.FileSize;
            }
            return false;
        }


    }
}


