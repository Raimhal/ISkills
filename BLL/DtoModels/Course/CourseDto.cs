using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class CourseDto : CreateCourseDto, IMapWith<Course>
    {
        public Guid Id { get; set; }

        public override void Mapping(Profile profile)
        {
            profile.CreateMap<CourseDto, Course>().ReverseMap();
        }
    }

}
