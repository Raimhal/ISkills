using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class CreateCategoryDto : IMapWith<Category>
    {  
        public string Title { get; set; }

        public virtual void Mapping(Profile profile)
        {
            profile.CreateMap<CreateCategoryDto, Category>()
                .ReverseMap();
        }
    }
}
