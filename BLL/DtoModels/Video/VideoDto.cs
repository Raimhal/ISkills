﻿using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class VideoDto : IMapWith<Video>
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid CourseId { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<VideoDto, Video>().ReverseMap();
        }
    }

}