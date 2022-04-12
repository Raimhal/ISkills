using Domain.Models;

namespace BLL.DtoModels
{
    public class AuthenticateResponse
    {
        public string Email { get; set; }
        public string JwtToken {get; set;}
        public string RefreshToken { get; set; }

        public AuthenticateResponse(User user, string jwtToken, string refreshToken)
        {
            Email = user.Email;
            JwtToken = jwtToken;
            RefreshToken = refreshToken;
        }
    }
}
