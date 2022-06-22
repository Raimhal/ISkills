using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using System.Collections.Generic;
using Domain.Models;

namespace ISkills.Controllers
{
    [ApiController]
    public class PurchaseController : BaseController
    {
        private readonly IPurchaseRepository _purchaseRepository;

        public PurchaseController(IPurchaseRepository commentService) => 
            (_purchaseRepository) = (commentService);

        [HttpGet]
        [Route("api/purchases/grouped")]
        public async Task<ActionResult<List<PurchaseDto>>> GetComments(CancellationToken cancellationToken,
            string sortOption = "date", bool reverse = false,
            Guid? courseId = null, DateTime? startDate = null, DateTime? endDate = null)
            => Ok(await _purchaseRepository.GetGroupedPurchases(sortOption, reverse, cancellationToken, courseId, startDate, endDate));


        [HttpGet]
        [Route("api/purchases")]
        public async Task<ActionResult<List<PurchaseDto>>> GetComments(CancellationToken cancellationToken,
            int skip = 0, int take = 10, string query = "", string sortOption = "date", bool reverse = false,
            Guid? courseId = null, DateTime? startDate = null, DateTime? endDate = null)
        {
            var content = await _purchaseRepository
                .GetList(skip, take, query, sortOption, reverse, cancellationToken, courseId, startDate, endDate);

            Response.Headers.Add("X-Total-Count", content.TotalCount.ToString());
            return Ok(content.List);
        }

        [HttpGet]
        [Route("api/purchases/all")]
        public async Task<ActionResult<List<PurchaseDto>>> GetComments(CancellationToken cancellationToken,
            string query = "", string sortOption = "date", bool reverse = false,
            Guid? courseId = null, DateTime? startDate = null, DateTime? endDate = null)
            => Ok(await _purchaseRepository.GetListAll(query, sortOption, reverse, cancellationToken, courseId, startDate, endDate));


        [HttpGet]
        [Route("api/purchases/{id}")]
        public async Task<ActionResult<Comment>> GetCourse(Guid id, CancellationToken cancellationToken)
            => Ok(await _purchaseRepository.GetByIdAsync(id, cancellationToken));

    }
}
