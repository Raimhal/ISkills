using FluentValidation;
using BLL.DtoModels;
using System;

namespace BLL.Validation.ModelValidators
{
    public class CreateCommentValidator : AbstractValidator<CreateCommentDto>
    {
        public CreateCommentValidator()
        {
            RuleFor(comment => comment.Content).NotEmpty().NotNull().MaximumLength(2048);
            RuleFor(comment => comment.CourseId).NotEmpty().NotNull().NotEqual(Guid.Empty);
        }
    }
}
