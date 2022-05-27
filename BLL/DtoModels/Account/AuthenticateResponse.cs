using Domain.Models;
using System;

namespace BLL.DtoModels
{
    public class AuthenticateResponse
    {
        public string JwtToken {get; set;}
        public string RefreshToken { get; set; }

        public AuthenticateResponse(string jwtToken, string refreshToken)
        {
            JwtToken = jwtToken;
            RefreshToken = refreshToken;
        }
    }
}
