using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;
using System.Collections.Generic;

namespace BLL.DtoModels
{
    public class UserStatisticModel 
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public double Rating { get; set; }  
        public int Count { get; set; } 

    }
}
