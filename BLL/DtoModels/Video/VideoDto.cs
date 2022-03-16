using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class VideoDto : UpdateVideoDto, IMapWith<Video>
    {
        public Guid Id { get; set; }
        public string Url { get; set; }

        public override void Mapping(Profile profile)
        {
            profile.CreateMap<VideoDto, Video>().ReverseMap();
        }
    }

}
