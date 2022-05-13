using System.ComponentModel.DataAnnotations;

namespace BLL.DtoModels
{
    public class AuthenticateRequest
    {
        public string Email { get; set; }
        public string? Password { get; set; }
    }
}
