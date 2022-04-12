using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class ThemeDto : CreateThemeDto, IMapWith<Theme>
    {
        public int Id { get; set; }

        public override void Mapping(Profile profile)
        {
            profile.CreateMap<ThemeDto, Theme>()
                .ReverseMap();
        }
    }
}
