using FluentValidation;
using BLL.DtoModels;

namespace BLL.Validation.ModelValidators
{
    public class AuthenticateRequestValidator : AbstractValidator<AuthenticateRequest> 
    {
        public AuthenticateRequestValidator()
        {
            RuleFor(request => request.Email).NotEmpty().MaximumLength(50);
            RuleFor(request => request.Password).NotEmpty().MinimumLength(5);
        }
    }

}

