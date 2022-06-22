using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;
using System.Text.Json.Serialization;

namespace BLL.DtoModels
{
    public class CreatePurchaseDto : IMapWith<Purchase>
    {
        public Guid CourseId { get; set; }

        public virtual void Mapping(Profile profile)
        {
            profile.CreateMap<CreatePurchaseDto, Purchase>();
        }
    }

}
