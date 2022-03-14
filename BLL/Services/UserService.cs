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
        private readonly ICourseDbContext _courseDbContext;
        private readonly IMapper _mapper;
        private readonly int saltSize = 16;

        public UserService(IUserDbContext userContext, IRoleDbContext roleContext,
            ICourseDbContext courseContext, IMapper mapper) 
            => (_userContext, _roleContext, _courseDbContext, _mapper)
            = (userContext, roleContext, courseContext, mapper);

        private readonly List<Expression<Func<User, dynamic>>> includes = new ()
        {
            x => x.Courses,
            x => x.Comments,
            x => x.Roles,
            x => x.RefreshTokens
        };

        public async Task<List<UserDto>> GetList(int skip, int take, string query, string sortOption, bool reverse)
            => await LookUp.GetListAsync<User, UserDto>(
                _userContext.Users,
                _mapper,
                skip,
                take,
                u => u.Email.Contains(query.ToLower().Trim()),
                sortOption,
                reverse);


        public async Task<List<UserDto>> GetListAll(string query, string sortOption, bool reverse)
            => await LookUp.GetListAllAsync<User, UserDto>(
                _userContext.Users,
                _mapper,
                u => u.Email.Contains(query.ToLower().Trim()),
                sortOption,
                reverse);


        public async Task<User> GetByIdAsync(Guid id)
            => await LookUp.GetAsync(_userContext.Users, _mapper, x => x.Id == id, includes);

        public async Task<User> GetByEmailAsync(string email)
            => await LookUp.GetAsync(_userContext.Users, _mapper, x => x.Email == email, includes);

        public async Task<Guid> GetIdFromEmail(string email)
            => (await GetUserDtoByEmail(email)).Id;


        private async Task<UserDto> GetUserDtoByEmail(string email)
            => await _userContext.Users.ProjectTo<UserDto>
            (_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Email == email);

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
            var user = await LookUp.GetAsync<User>(_userContext.Users,
                _mapper, u => u.Id == id, new() { });

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.UserName = model.UserName;

            if (!string.IsNullOrEmpty(model.Email) && model.Email != user.Email)
            {
                if (await _userContext.Users.AnyAsync(u => u.Email == model.Email, cancellationToken))
                    throw new AlreadyExistsException(nameof(User), nameof(model.Email), model.Email);
                user.Email = model.Email;
            }

            if (!string.IsNullOrEmpty(model.Password)) 
                user.Password = Hasher.GetSaltedHash(model.Password, user.Salt);

            _userContext.Users.Update(user);

            await _userContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            var user = await LookUp.GetAsync<User>(_userContext.Users, _mapper, u => u.Id == id, new() { x => x.Courses });
            _courseDbContext.Courses.RemoveRange(user.Courses);
            foreach (var course in user.Courses)
            {
                foreach (var chapter in course.Chapters)
                {
                    foreach (var video in chapter.Videos)
                    {

                    }
                }
            }
            _userContext.Users.Remove(user);
            await _userContext.SaveChangesAsync(cancellationToken);   
        }

        

    }
}
