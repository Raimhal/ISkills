using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;

namespace BLL.DtoModels
{
    public class UpdateVideoDto : IMapWith<Video>
    {
        public string Title { get; set; }
        public Guid ChapterId { get; set; }

        public virtual void Mapping(Profile profile)
        {
            profile.CreateMap<UpdateVideoDto, Video>();
        }
    }

}
