using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using BLL.Validation;
using BLL.Validation.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace BLL.Services
{
    class PurchaseRepository : IPurchaseRepository
    {
        private readonly IPurchaseDbContext _purchaseDbContext;
        private readonly ICourseDbContext _courseDbContext;
        private readonly IMapper _mapper;
        private readonly IBraintreeService _braintreeService;

        public PurchaseRepository(IPurchaseDbContext purchaseDbContext, ICourseDbContext courseDbContext,
            IBraintreeService braintreeService, IMapper mapper) 
            => (_purchaseDbContext, _courseDbContext, _braintreeService, _mapper) 
            = (purchaseDbContext, courseDbContext, braintreeService, mapper);

        public async Task<string> GenerateClientToken() 
            => await _braintreeService.GetGateway().ClientToken.GenerateAsync();


        public async Task<PaginationList<PurchaseDto>> GetList(int skip, int take, string query, string sortOption,
            bool reverse, CancellationToken cancellationToken, params object[] dynamics)
        {
            var courseId = (Guid?)dynamics[0];
            var startDate = (DateTime?)dynamics[1];
            var endDate = (DateTime?)dynamics[2];

            return await _purchaseDbContext.Purchases.GetListAsync<Purchase, PurchaseDto>(
                _mapper,
                skip,
                take,
                p => (courseId == null || p.CourseId == courseId) 
                    && (startDate == null || p.Date >= startDate) 
                    && (endDate == null || p.Date <= endDate),
                sortOption,
                reverse,
                new() { },
                cancellationToken);
        }

        public async Task<List<PurchaseDto>> GetListAll(string query, string sortOption,
            bool reverse, CancellationToken cancellationToken, params object[] dynamics)
        {
            var courseId = (Guid?)dynamics[0];
            var startDate = (DateTime?)dynamics[1];
            var endDate = (DateTime?)dynamics[2];

            return await _purchaseDbContext.Purchases.GetListAllAsync<Purchase, PurchaseDto>(
                _mapper,
                p => (courseId == null || p.CourseId == courseId) 
                    && (startDate == null || p.Date >= startDate) 
                    && (endDate == null || p.Date <= endDate),
                sortOption,
                reverse,
                new() { },
                cancellationToken);
        }

        public async Task<List<GroupedItem>> GetGroupedPurchases(string sortOption,
            bool reverse, CancellationToken cancellationToken, params object[] dynamics)
        {
            var courseId = (Guid?)dynamics[0];
            var startDate = (DateTime?)dynamics[1];
            var endDate = (DateTime?)dynamics[2];

            return await _purchaseDbContext.Purchases.CustomGroupByAsync(
                p => (courseId == null || p.CourseId == courseId) 
                    && (startDate == null || p.Date >= startDate) 
                    && (endDate == null || p.Date <= endDate),
                sortOption,
                reverse,
                p => p.Date.ToString());

        }

        public async Task<Purchase> GetByIdAsync(Guid id, CancellationToken cancellationToken)
            => await _purchaseDbContext.Purchases.GetAsync(
                _mapper,
                x => x.Id == id,
                new() { x => x.Course },
                cancellationToken);

        public async Task<Guid> CreateAsync(CreatePurchaseDto model, CancellationToken cancellationToken)
        {
            Expression<Func<Course, bool>> courseExpression = c => c.Id == model.CourseId;
            var course = await _courseDbContext.Courses
                .GetAsync(_mapper, p => p.Id == model.CourseId, new() { }, cancellationToken);

            var purchuse = _mapper.Map<Purchase>(model);
            purchuse.Id = Guid.NewGuid();
            purchuse.Date = DateTime.Today;

            await _purchaseDbContext.Purchases.AddAsync(purchuse, cancellationToken);
            await _purchaseDbContext.SaveChangesAsync(cancellationToken);

            course.Purchases.Add(purchuse);
            await _courseDbContext.SaveChangesAsync(cancellationToken);

            return purchuse.Id;
        }
    }
}
