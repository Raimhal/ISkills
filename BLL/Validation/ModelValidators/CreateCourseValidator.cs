using FluentValidation;
using BLL.DtoModels;

namespace BLL.Validation.ModelValidators
{
    public class CreateCourseValidator : AbstractValidator<CreateCourseDto>
    {
        public CreateCourseValidator()
        {
            RuleFor(course => course.Title).NotEmpty().NotNull().MaximumLength(256);
            RuleFor(course => course.Language).NotEmpty().NotNull().MaximumLength(64);
        }
    }
}
