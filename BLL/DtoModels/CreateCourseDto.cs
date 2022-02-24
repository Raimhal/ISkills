using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class CreateCourseDto : IMapWith<Course>
    {
        public string Title { get; set; }
        public string ShortInfo { get; set; }
        public string Requirements { get; set; }
        public string Description { get; set; }
        public string Language { get; set; }
        public float Price { get; set; }
        public int ThemeId { get; set; }
        public Guid CreatorId { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<CreateCourseDto, Course>();
        }
    }

}
