using FluentValidation;
using BLL.DtoModels;
using System;

namespace BLL.Validation.ModelValidators
{
    public class CreateChapterValidator : AbstractValidator<CreateChapterDto>
    {
        public CreateChapterValidator()
        {
            RuleFor(chapter => chapter.Title).NotEmpty().NotNull().MaximumLength(256);
            RuleFor(chapter => chapter.CourseId).NotEmpty().NotNull().NotEqual(Guid.Empty);
        }
    }
}
