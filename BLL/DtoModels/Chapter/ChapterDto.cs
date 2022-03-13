using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class ChapterDto : IMapWith<Chapter>
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid CourseId { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<ChapterDto, Chapter>().ReverseMap();
        }
    }

}
