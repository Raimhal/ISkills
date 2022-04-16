using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class CommentDto : CreateCommentDto, IMapWith<Comment>
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public DateTime DateUpdated { get; set; }
        public UserDto Creator { get; set; }

        public override void Mapping(Profile profile)
        {
            profile.CreateMap<CommentDto, Comment>().ReverseMap();
        }
    }

}
