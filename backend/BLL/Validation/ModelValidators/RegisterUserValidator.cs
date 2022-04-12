using FluentValidation;
using BLL.DtoModels;

namespace BLL.Validation.ModelValidators
{
    public class RegisterUserValidator : AbstractValidator<RegisterUserModel> 
    {
        public RegisterUserValidator()
        {
            RuleFor(user => user.FirstName).MaximumLength(64);
            RuleFor(user => user.LastName).MaximumLength(64);
            RuleFor(user => user.UserName).NotEmpty().NotNull().MaximumLength(64);
            RuleFor(user => user.Email).NotEmpty().NotNull().EmailAddress().WithMessage("A valid email address is required").MaximumLength(64);
            RuleFor(user => user.Password).NotEmpty().NotNull().MinimumLength(5);
        }
    }
}
