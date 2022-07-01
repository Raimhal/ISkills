using Braintree;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IBraintreeService
    {
        IBraintreeGateway GetGateway();
        Task ExecuteTransaction(decimal price, string paymentNonce);
    }
}
