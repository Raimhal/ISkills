using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;

namespace BLL.DtoModels
{
    public class CreateVideoByUrlDto : UpdateVideoDto, IMapWith<Video>
    {
        public string Url { get; set; }

        public override void Mapping(Profile profile)
        {
            profile.CreateMap<CreateVideoByUrlDto, Video>();
        }
    }

}
