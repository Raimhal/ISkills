using AutoMapper;
using System;
using BLL.Mapping;
using Domain.Models;

namespace BLL.DtoModels
{
    public class RefreshTokenDto : IMapWith<RefreshToken>
    {
        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public DateTime Created { get; set; }
        public string CreatedByIp { get; set; }
        public DateTime? Revoked { get; set; }
        public string RevokedByIp { get; set; }
        public string ReplaceByToken { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;
        public void Mapping(Profile profile)
        {
            profile.CreateMap<RefreshTokenDto, RefreshToken>();
        }
    }

}
