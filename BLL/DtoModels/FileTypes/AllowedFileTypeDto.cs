using AutoMapper;
using BLL.Mapping;
using Domain.Models;
using System;

namespace BLL.DtoModels
{
    public class AllowedFileTypeDto : IMapWith<AllowedFileType>
    {
        public Guid Id { get; set; }
        public string FileType { get; set; }
        public double FileSize { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<AllowedFileType, AllowedFileTypeDto>().ReverseMap();
        }

    }
}
