using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace BLL
{
    public class AuthOptions
    {
        public const string ISSUER = "ISkillsServer"; 
        public const string AUDIENCE = "Iskills"; 
        const string KEY = "BQsaPQExFthrFnAk9Kr9F64dTQBcLgRb";  
        public const int LIFETIME = 6; 
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}
