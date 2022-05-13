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
        public int Rating { get; set; }
        [JsonIgnore]
        public Guid CreatorId { get; set; }

        public virtual void Mapping(Profile profile)
        {
            profile.CreateMap<CreateCommentDto, Comment>();
        }
    }

}
