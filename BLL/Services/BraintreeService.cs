using BLL.Interfaces;
using BLL.Validation.Exceptions;
using Braintree;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using env = System.Environment;

namespace BLL.Services
{
    public class BraintreeService : IBraintreeService
    {
        public IBraintreeGateway GetGateway()
            => new BraintreeGateway()
            {
                Environment = env.GetEnvironmentVariable("BraintreeEnvironment") == "production" ? Braintree.Environment.PRODUCTION : Braintree.Environment.SANDBOX,
                MerchantId = env.GetEnvironmentVariable("MerchantId"),
                PublicKey = env.GetEnvironmentVariable("PublicKey"),
                PrivateKey = env.GetEnvironmentVariable("PrivateKey")
            };

        public async Task ExecuteTransaction(decimal price, string paymentNonce)
        {
            var gateway = GetGateway();
            var request = new TransactionRequest
            {
                Amount = price,
                PaymentMethodNonce = paymentNonce,
                Options = new TransactionOptionsRequest
                {
                    SubmitForSettlement = true
                }
            };

            var result = await gateway.Transaction.SaleAsync(request);
            if (!result.IsSuccess())
                throw new ConflictException("Transaction failed");
        }
    }
}
