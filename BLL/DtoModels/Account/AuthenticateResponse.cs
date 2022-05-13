using Domain.Models;
using System;

namespace BLL.DtoModels
{
    public class AuthenticateResponse
    {
        public string Email { get; set; }
        public string JwtToken {get; set;}
        public string RefreshToken { get; set; }
        public Guid UserId { get; set; }

        public AuthenticateResponse(User user, string jwtToken, string refreshToken)
        {
            Email = user.Email;
            UserId = user.Id;
            JwtToken = jwtToken;
            RefreshToken = refreshToken;
        }
    }
}
