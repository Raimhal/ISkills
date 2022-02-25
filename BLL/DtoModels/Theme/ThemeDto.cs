using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class ThemeDto : IMapWith<Theme>
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int CategoryId { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<ThemeDto, Theme>()
                .ReverseMap();
        }
    }
}
