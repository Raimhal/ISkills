﻿using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;

namespace BLL.DtoModels
{
    public class CreateVideoDto : IMapWith<Video>
    {
        public string Title { get; set; }
        public IFormFile File { get; set; }
        [JsonIgnore]
        public Guid ChapterId { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<CreateVideoDto, Video>();
        }
    }

}
