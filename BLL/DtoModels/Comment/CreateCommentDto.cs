using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;
using System.Text.Json.Serialization;

namespace BLL.DtoModels
{
    public class CreateCommentDto : IMapWith<Comment>
    {

        public string Content { get; set; }
        public Guid CourseId { get; set; }
        [JsonIgnore]
        public Guid CreatorId { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<CreateCommentDto, Comment>();
        }
    }

}
