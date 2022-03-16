using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class CategoryDto : CreateCategoryDto, IMapWith<Category>
    {
        public int Id { get; set; }

        public override void Mapping(Profile profile)
        {
            profile.CreateMap<CategoryDto, Category>()
                .ReverseMap();
        }
    }
}
