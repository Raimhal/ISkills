using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class UserDto : IMapWith<User>
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public double Rating { get; set; }  

        public void Mapping(Profile profile)
        {
            profile.CreateMap<UserDto, User>()
                .ReverseMap();
        }
    }
}
