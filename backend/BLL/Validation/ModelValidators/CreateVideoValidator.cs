using FluentValidation;
using BLL.DtoModels;
using System;

namespace BLL.Validation.ModelValidators
{
    public class CreateVideoValidator : AbstractValidator<CreateVideoDto>
    {
        public CreateVideoValidator()
        {
            RuleFor(video => video.Title).NotEmpty().NotNull().MaximumLength(256);
            RuleFor(video => video.ChapterId).NotEmpty().NotNull().NotEqual(Guid.Empty);
        }
    }
}
