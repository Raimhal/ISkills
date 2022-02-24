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

namespace BLL.Services
{
    class UserService : IUserService
    {
        private readonly IUserDbContext _userContext;
        private readonly IRoleDbContext _roleContext;
        private readonly IMapper _mapper;
        private readonly int saltSize = 16;

        public UserService(IUserDbContext userContext, IRoleDbContext roleContext,IMapper mapper) =>
            (_userContext, _roleContext ,_mapper) = (userContext, roleContext, mapper);

        public async Task<Guid> CreateAsync(RegisterUserModel model, CancellationToken cancellationToken)
        {
            if (await _userContext.Users.SingleOrDefaultAsync(u =>
                 u.Email == model.Email, cancellationToken) != null)
                throw new InvalidCastException($"User with this email ({model.Email}) already exists");

            var user = _mapper.Map<User>(model);
            user.Id = Guid.NewGuid();

            var role = await _roleContext.Roles
                .FirstOrDefaultAsync(r =>
                r.Name == "User", cancellationToken);

            user.Roles = new List<Role> { role };

            user.Salt = Hasher.GenerateSalt(saltSize);
            user.Password = Hasher.GetSaltedHash(user.Password, user.Salt);

            await _userContext.Users.AddAsync(user, cancellationToken);
            await _userContext.SaveChangesAsync(cancellationToken);

            return user.Id;

        }

        public async Task UpdateAsync(Guid id, RegisterUserModel model, CancellationToken cancellationToken)
        {
            Expression<Func<User, bool>> expression = u => u.Id == id;
            var user = await _userContext.Users
                .FirstOrDefaultAsync(expression, cancellationToken);

            if (user == null)
                throw new NotFoundException(nameof(User), id);

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.UserName = model.UserName;

            if (!string.IsNullOrEmpty(model.Email) && model.Email != user.Email)
            {
                if (await _userContext.Users.AnyAsync(u => u.Email == model.Email, cancellationToken))
                    throw new Exception(message: "A user with the same email address already exists");
                user.Email = model.Email;
            }

            if (!string.IsNullOrEmpty(model.Password)) 
                user.Password = Hasher.GetSaltedHash(model.Password, user.Salt);

            _userContext.Users.Update(user);

            await _userContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            if(id != Guid.Empty)
            {
                Expression<Func<User, bool>> expression = u => u.Id == id;
                var user = await _userContext.Users.FirstOrDefaultAsync(expression, cancellationToken);
                if (user == null)
                    throw new NotFoundException(nameof(User), id);
                _userContext.Users.Remove(user);
                await _userContext.SaveChangesAsync(cancellationToken);   
                
            }
        }
        public async Task<List<UserDto>> GetList(int skip, int take, string query, string sortOption, bool reverse)
        {
            Expression<Func<User, bool>> expression = u => u.Email.Contains(query.ToLower().Trim());
            return await LookUp.GetListAsync<User, UserDto>(_userContext.Users, _mapper, skip, take, expression, sortOption, reverse);
        }

        public async Task<List<UserDto>> GetListAll(string query, string sortOption, bool reverse)
        {
            Expression<Func<User, bool>> expression = u => u.Email.Contains(query.ToLower().Trim());
            return await LookUp.GetListAllAsync<User, UserDto>(_userContext.Users, _mapper, expression, sortOption, reverse);
        }

        public async Task<User> GetByIdAsync(Guid id)
        {
            Expression<Func<User, bool>> expression = x => x.Id == id;
            return await LookUp.GetAsync(_userContext.Users, _mapper, expression, includes);
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            Expression<Func<User, bool>> expression = x => x.Email == email;
            return await LookUp.GetAsync(_userContext.Users, _mapper, expression, includes);
        }

        public async Task<Guid> GetIdFromEmail(string email)
            => (await GetUserDtoByEmail(email)).Id;


        private List<Expression<Func<User, dynamic>>> includes = new List<Expression<Func<User, dynamic>>> {
                x => x.Courses,
                x => x.Comments,
                x => x.Roles,
                x => x.RefreshTokens
        };

        private async Task<UserDto> GetUserDtoByEmail(string email) 
            => await _userContext.Users.ProjectTo<UserDto>
            (_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Email == email);
    }
}
