using FluentValidation;
using BLL.DtoModels;

namespace BLL.Validation.ModelValidators
{
    public class AuthenticateRequestValidator : AbstractValidator<AuthenticateRequest> 
    {
        public AuthenticateRequestValidator()
        {
            RuleFor(request => request.Email).NotEmpty().NotNull().EmailAddress().WithMessage("A valid email address is required").MaximumLength(64);
            RuleFor(request => request.Password).NotEmpty().NotNull().MinimumLength(5);
        }
    }

}

