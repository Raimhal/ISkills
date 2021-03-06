using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;
using System.Text.Json.Serialization;

namespace BLL.DtoModels
{
    public class CreateCourseDto : IMapWith<Course>
    {
        public string Title { get; set; }
        public string ShortInfo { get; set; }
        public string Requirements { get; set; }
        public string Description { get; set; }
        public string Language { get; set; }
        public decimal Price { get; set; }
        public int ThemeId { get; set; }
        [JsonIgnore]
        public Guid CreatorId { get; set; }

        public virtual void Mapping(Profile profile)
        {
            profile.CreateMap<CreateCourseDto, Course>();
        }
    }

}
