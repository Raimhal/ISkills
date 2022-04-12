using AutoMapper;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class CreateAllowedFileTypeDto : IMapWith<AllowedFileType>
    {
        public string FileType { get; set; }
        public double FileSize { get; set; }

        public virtual void Mapping(Profile profile)
        {
            profile.CreateMap<CreateAllowedFileTypeDto, AllowedFileType>();
        }

    }
}
