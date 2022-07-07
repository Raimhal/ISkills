using BLL.DtoModels;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IPurchaseRepository : IBaseRepository<Guid, Purchase, CreatePurchaseDto, PurchaseDto>
    {
        Task<List<DayGroupedItem>> GetGroupedPurchases(string sortOption, bool reverse, CancellationToken cancellationToken, params object[] dynamics);
        Task<List<MonthGroupedItem>> GetGroupedYearPurchases(string sortOption, bool reverse, int year, CancellationToken cancellationToken, params object[] dynamics);
        Task<string> GenerateClientToken();
    }
}
