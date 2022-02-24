using FluentValidation;
using BLL.DtoModels;

namespace BLL.Validation.ModelValidators
{
    public class AllowedFileTypeValidator : AbstractValidator<AllowedFileTypeDto>
    {
        public AllowedFileTypeValidator()
        {
            RuleFor(request => request.FileType).NotEmpty().MaximumLength(8);
            RuleFor(request => request.FileSize).NotEmpty().NotNull();
        }
    }
}
