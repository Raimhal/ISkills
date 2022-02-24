using AutoMapper;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class AllowedFileTypeDto : IMapWith<AllowedFileType>
    {
        public string FileType { get; set; }
        public double FileSize { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<AllowedFileType, AllowedFileTypeDto>().ReverseMap();
        }

    }
}
