using System;
using Domain.Interfaces;

namespace Domain.Models
{
    public class RefreshToken : IEntity<Guid>
    {
        public Guid Id { get; set; }
        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public DateTime Created { get; set; }
        public string CreatedByIp { get; set; }
        public DateTime? Revoked { get; set; }
        public string RevokedByIp { get; set; }
        public string ReplaceByToken { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;
        public Guid UserId { get; set; }
        public User User { get; set; }
        
    }
}
