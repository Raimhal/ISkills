using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using BLL.DtoModels;
using BLL.Interfaces;
using BLL.Validation;
using BLL.Validation.Exceptions;
using Domain.Interfaces;
using Domain.Models;

namespace BLL.Services
{
    public class AccountRepository : IAccountRepository
    {
        private readonly IUserDbContext _userContext;
        private readonly IRefreshTokenDbContext _refreshTokenContext;
        private readonly IMapper _mapper;

        public AccountRepository(IUserDbContext userContext, IRefreshTokenDbContext refreshTokenContext, IMapper mapper) =>
            (_userContext, _refreshTokenContext, _mapper) = (userContext, refreshTokenContext, mapper);

        public async Task<AuthenticateResponse> Authenticate(AuthenticateRequest model, string ip, CancellationToken cancellationToken)
        {
            var user = await _userContext.Users.GetAsync(_mapper,
                u => u.Email == model.Email,
                new() { u => u.Roles, u => u.RefreshTokens }, cancellationToken);

            if (!model.Password.AreEqual(user.Salt, user.Password))
                throw new ConflictException(message: "Email or password is incorrect");

            RefreshToken refreshToken;
            if (!user.RefreshTokens.Any(t => t.IsActive == true))
            {
                var refreshTokenDto = GenerateRefreshToken(ip);
                refreshToken = _mapper.Map<RefreshToken>(refreshTokenDto);

                user.RefreshTokens.Add(refreshToken);
                await _userContext.SaveChangesAsync(cancellationToken);
            }
            else
                refreshToken = user.RefreshTokens
                    .FirstOrDefault(t => t.IsActive);

            var jwtToken = GenerateJwtToken(user);

            return new AuthenticateResponse(jwtToken, refreshToken.Token);
        }

        public async Task<AuthenticateResponse> RefreshToken(string token , string ip, CancellationToken cancellationToken)
        {
            var user = await _userContext.Users.GetAsync(_mapper,
                u => u.RefreshTokens.Any(t => t.Token == token),
                new () { u => u.Roles, u => u.RefreshTokens }, cancellationToken);


            var refreshToken = user.RefreshTokens
                .FirstOrDefault(t => t.Token == token);

            var newRefreshTokenDto = GenerateRefreshToken(ip);

            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ip;
            refreshToken.ReplaceByToken = newRefreshTokenDto.Token;

            var newRefreshToken = _mapper.Map<RefreshToken>(newRefreshTokenDto);

            user.RefreshTokens.Add(newRefreshToken);
            var jwtToken = GenerateJwtToken(user);
            
            await _userContext.SaveChangesAsync(cancellationToken);

            return new AuthenticateResponse(jwtToken, refreshToken.Token);

        }
        public async Task<bool> RevokeToken(string token, string ip, CancellationToken cancellationToken)
        {
            var user = await _userContext.Users.GetAsync(_mapper,
                u => u.RefreshTokens.Any(t => t.Token == token),
                new() { u => u.RefreshTokens }, cancellationToken);

            var refreshToken = user.RefreshTokens
                .Single(t => t.Token == token);

            if (!refreshToken.IsActive) 
                return false;

            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ip;
            await _userContext.SaveChangesAsync(cancellationToken);

            return true;
        }

        private static ClaimsIdentity GetIdentity(User user)
        {
            var claims = new List<Claim> {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            foreach (var role in user.Roles)
                claims.Add(new Claim(ClaimTypes.Role, role.Name));

            var claimsIdentity = new ClaimsIdentity(claims, "Token",
                ClaimsIdentity.DefaultRoleClaimType, ClaimsIdentity.DefaultRoleClaimType);

            return claimsIdentity;
        }
        private static string GenerateJwtToken(User user)
        {
            var identity = GetIdentity(user);
            var now = DateTime.UtcNow;

            var jwtToken = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                notBefore: now,
                claims: identity.Claims,
                expires: now.AddHours(AuthOptions.LIFETIME),
                signingCredentials: new SigningCredentials(
                    AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256)
                );

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }

        private static RefreshTokenDto GenerateRefreshToken(string ip)
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[64];
            rngCryptoServiceProvider.GetBytes(randomBytes);

            return new RefreshTokenDto
            {
                Token = Convert.ToBase64String(randomBytes),
                Expires = DateTime.UtcNow.AddDays(7),
                Created = DateTime.UtcNow,
                CreatedByIp = ip
            };
        }
    }
}
