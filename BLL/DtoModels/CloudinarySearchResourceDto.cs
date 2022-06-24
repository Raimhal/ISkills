using AutoMapper;
using BLL.Mapping;
using CloudinaryDotNet.Actions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DtoModels
{
    public class CloudinarySearchResourceDto : IMapWith<SearchResource>
    {
        public string Created { get; set; }
        public string FileName { get; set; }
        public string Url { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<SearchResource, CloudinarySearchResourceDto>().ReverseMap();
        }
    }
}
