using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class CommentDto : IMapWith<Comment>
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public DateTime DateUpdated { get; set; }
        public Guid CourseId { get; set; }
        public Guid CreatorId { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<CommentDto, Comment>().ReverseMap();
        }
    }

}
