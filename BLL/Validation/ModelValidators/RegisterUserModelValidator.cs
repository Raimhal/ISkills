using FluentValidation;
using BLL.DtoModels;

namespace BLL.Validation.ModelValidators
{
    public class RegisterUserModelValidator : AbstractValidator<RegisterUserModel> 
    {
        public RegisterUserModelValidator()
        {
            RuleFor(user => user.FirstName).MaximumLength(50);
            RuleFor(user => user.LastName).MaximumLength(50);
            RuleFor(user => user.UserName).NotEmpty().MaximumLength(50);
            RuleFor(user => user.Email).NotEmpty().MaximumLength(50);
            RuleFor(user => user.Password).NotEmpty().MinimumLength(5);


        }
    }
}
