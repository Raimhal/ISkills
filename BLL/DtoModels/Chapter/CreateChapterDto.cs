using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;
using System.Text.Json.Serialization;

namespace BLL.DtoModels
{
    public class CreateChapterDto : IMapWith<Chapter>
    {
        public string Title { get; set; }
        public string Description { get; set; }
        [JsonIgnore]
        public Guid CourseId { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<CreateChapterDto, Chapter>();
        }
    }

}
