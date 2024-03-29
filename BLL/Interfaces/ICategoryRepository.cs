﻿using BLL.DtoModels;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface ICategoryRepository : IRepository<int, Category, CreateCategoryDto, CategoryDto>
    {
    }
}
