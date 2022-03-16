using AutoMapper;
using BLL.Mapping;
using Domain.Models;
using System;

namespace BLL.DtoModels
{
    public class AllowedFileTypeDto : CreateAllowedFileTypeDto, IMapWith<AllowedFileType>
    {
        public Guid Id { get; set; }
        public string FileType { get; set; }
        public double FileSize { get; set; }

        public override void Mapping(Profile profile)
        {
            profile.CreateMap<AllowedFileType, AllowedFileTypeDto>().ReverseMap();
        }

    }
}
