using AutoMapper;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class UpdateUserModel : IMapWith<User>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<UpdateUserModel, User>()
                .ReverseMap();

        }
    }
}
