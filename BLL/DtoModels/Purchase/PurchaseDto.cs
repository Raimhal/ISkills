using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;
using System.Text.Json.Serialization;

namespace BLL.DtoModels
{
    public class PurchaseDto : CreatePurchaseDto, IMapWith<Purchase>
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }

        public override void Mapping(Profile profile)
        {
            profile.CreateMap<PurchaseDto, Purchase>().ReverseMap();
        }
    }

}
