using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class CreateThemeDto : IMapWith<Theme>
    {  
        public string Title { get; set; }
        public int CategoryId { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<CreateThemeDto, Theme>()
                .ReverseMap();
        }
    }
}
