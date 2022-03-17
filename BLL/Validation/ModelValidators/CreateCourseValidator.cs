using FluentValidation;
using BLL.DtoModels;
using System;

namespace BLL.Validation.ModelValidators
{
    public class CreateCourseValidator : AbstractValidator<CreateCourseDto>
    {
        public CreateCourseValidator()
        {
            RuleFor(course => course.Title).NotEmpty().NotNull().MaximumLength(256);
            RuleFor(course => course.ShortInfo).NotEmpty().NotNull().MaximumLength(256);
            RuleFor(course => course.Requirements).NotNull().MaximumLength(2048);
            RuleFor(course => course.Description).NotNull().MaximumLength(2048);
            RuleFor(course => course.Language).NotEmpty().NotNull().MaximumLength(64);
        }
    }
}
