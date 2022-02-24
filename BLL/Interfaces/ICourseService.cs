﻿using BLL.DtoModels;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface ICourseService : IBaseService<Course, CreateCourseDto, CourseDto>
    {
        Task<List<CourseDto>> GetAll(int skip, int take, string query, string sortOption, bool reverse);
    }
}
