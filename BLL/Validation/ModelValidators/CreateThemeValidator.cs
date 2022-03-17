using FluentValidation;
using BLL.DtoModels;

namespace BLL.Validation.ModelValidators
{
    public class CreateThemeValidator : AbstractValidator<CreateThemeDto> 
    {
        public CreateThemeValidator()
        {
            RuleFor(theme => theme.Title).NotEmpty().NotNull().MaximumLength(256);
            RuleFor(theme => theme.CategoryId).NotEmpty().NotNull().NotEqual(0);
        }
    }
}
