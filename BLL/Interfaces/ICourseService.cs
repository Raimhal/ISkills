using BLL.DtoModels;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface ICourseService : IBaseService<Guid, Course, CreateCourseDto, CourseDto>, IParentService<Guid, CourseDto>, IParentService<int, CourseDto>
    {
        Task ToggleUserAssignment(Guid userId, Guid courseId, CancellationToken cancellationToken);
    }
}
