using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class ChapterDto : CreateChapterDto, IMapWith<Chapter>
    {
        public Guid Id { get; set; }

        public override void Mapping(Profile profile)
        {
            profile.CreateMap<ChapterDto, Chapter>().ReverseMap();
        }
    }

}
