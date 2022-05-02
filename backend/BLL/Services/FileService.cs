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

        public FileService(IAllowedFileTypeDbContext fileTypesContext, IMapper mapper) =>
            (_fileTypesContext, _mapper) = (fileTypesContext, mapper);

        public async Task<AllowedFileType> GetByIdAsync(int id, CancellationToken cancellationToken)
            => await _fileTypesContext.AllowedFileTypes.GetAsync(
                _mapper,
                x => x.Id == id,
                new () { },
                cancellationToken);

        public async Task<PaginationList<AllowedFileTypeDto>> GetList(int skip, int take,
            string query, string sortOption, bool reverse, CancellationToken cancellationToken, params object[] dynamics)
            => await _fileTypesContext.AllowedFileTypes.GetListAsync<AllowedFileType, AllowedFileTypeDto>(
                _mapper,
                skip,
                take,
                c => c.FileType.Contains(query.ToLower().Trim()),
                sortOption,
                reverse,
                new() { },
                cancellationToken);

        public async Task<List<AllowedFileTypeDto>> GetListAll(string query, string sortOption,
            bool reverse, CancellationToken cancellationToken, params object[] dynamics)
            => await _fileTypesContext.AllowedFileTypes.GetListAllAsync<AllowedFileType, AllowedFileTypeDto>(
                _mapper,
                c => c.FileType.Contains(query.ToLower().Trim()),
                sortOption,
                reverse,
                new() { },
                cancellationToken);

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
            var type = await _fileTypesContext.AllowedFileTypes.GetAsync(
                _mapper, t => t.Id == id, new() { }, cancellationToken);

            if (!string.IsNullOrEmpty(model.FileType) && model.FileType != type.FileType)
                if (await _fileTypesContext.AllowedFileTypes
                    .AnyAsync(t => t.FileType == model.FileType, cancellationToken))
                    throw new AlreadyExistsException(nameof(AllowedFileType), nameof(model.FileType), model.FileType);


            type.FileType = model.FileType;
            type.FileSize = model.FileSize;

            _fileTypesContext.AllowedFileTypes.Update(type);
            await _fileTypesContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(int id, CancellationToken cancellationToken)
        {
            await _fileTypesContext.AllowedFileTypes.DeleteByAsync(
                _mapper, t => t.Id == id, cancellationToken);
            await _fileTypesContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<bool> IsValidFile(IFormFile file)
        {
            if (file?.Length <= 0)
                return false;

            var extension = Path.GetExtension(file.FileName).Replace(".", "");
            var type = await _fileTypesContext.AllowedFileTypes.GetAsync(
                _mapper, t => t.FileType == extension, new() { }, CancellationToken.None);

            return (file.Length / Math.Pow(10, 6)) <= type.FileSize;
        }
    }
}


