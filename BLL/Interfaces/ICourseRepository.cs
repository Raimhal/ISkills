using BLL.DtoModels;
using Domain.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface ICourseRepository : IRepository<Guid, Course, CreateCourseDto, CourseDto>, IParentRepository<Guid, CourseDto>
    {
        Task AssignUserToCourse(Guid userId, Guid courseId, CancellationToken cancellationToken, string paymentNonce = null);
        Task<string> UpdateImageAsync(Guid id, IFormFile file, int width, int height, CancellationToken cancellationToken);
    }
}
