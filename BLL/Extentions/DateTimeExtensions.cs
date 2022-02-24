using System;
using Domain.Models;

namespace Domain.Extentions
{
    public static class DateTimeExtensions
    {
        public static Status UpdateStatus(this DateTime start, DateTime end)
        {
            var now = DateTime.UtcNow;
            if (now < start)
                return Status.Expected;
            else if (start <= now && now < end)
                return Status.InProgress;
            return Status.Ended;
        }
    }
}
