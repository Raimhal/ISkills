using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;
using System.Collections.Generic;

namespace BLL.DtoModels
{
    public class UserDetailsDto : UserDto, IMapWith<User>
    {
        public List<CourseDto> Courses { get; set; }

        public override void Mapping(Profile profile)
        {
            profile.CreateMap<UserDetailsDto, User>()
                .ReverseMap();
        }
    }
}
