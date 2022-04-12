using FluentValidation;
using BLL.DtoModels;

namespace BLL.Validation.ModelValidators
{
    public class CreateAllowedFileTypeValidator : AbstractValidator<CreateAllowedFileTypeDto>
    {
        public CreateAllowedFileTypeValidator()
        {
            RuleFor(request => request.FileType).NotEmpty().NotNull().MaximumLength(8);
            RuleFor(request => request.FileSize).NotEmpty().NotNull();
        }
    }
}
