using FluentValidation;
using BLL.DtoModels;

namespace BLL.Validation.ModelValidators
{
    public class UpdateUserValidation : AbstractValidator<UpdateUserModel> 
    {
        public UpdateUserValidation()
        {
            RuleFor(user => user.FirstName).MaximumLength(64);
            RuleFor(user => user.LastName).MaximumLength(64);
            RuleFor(user => user.UserName).NotEmpty().NotNull().MaximumLength(64);
            RuleFor(user => user.Email).NotEmpty().NotNull().EmailAddress().WithMessage("A valid email address is required").MaximumLength(64);
        }
    }
}
