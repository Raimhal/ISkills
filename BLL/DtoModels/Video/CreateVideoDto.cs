using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;

namespace BLL.DtoModels
{
    public class CreateVideoDto : UpdateVideoDto, IMapWith<Video>
    {
        public IFormFile File { get; set; }

        public override void Mapping(Profile profile)
        {
            profile.CreateMap<CreateVideoDto, Video>();
        }
    }

}
