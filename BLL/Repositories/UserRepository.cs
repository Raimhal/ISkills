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
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.IO;

namespace BLL.Services
{
    class UserRepository : IUserRepository
    {
        private readonly IUserDbContext _userContext;
        private readonly IRoleDbContext _roleContext;
        private readonly ICourseDbContext _courseDbContext;
        private readonly IFileRepository _fileRepository;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IMapper _mapper;
        private readonly int saltSize = 16;

        public UserRepository(IUserDbContext userContext, IRoleDbContext roleContext,
            ICourseDbContext courseContext, IFileRepository fileRepository,
            ICloudinaryService cloudinaryService, IMapper mapper) 
            => (_userContext, _roleContext, _courseDbContext, _fileRepository, _cloudinaryService, _mapper)
            = (userContext, roleContext, courseContext, fileRepository, cloudinaryService ,mapper);


        public async Task<PaginationList<UserDto>> GetList(int skip, int take,
           string query, string sortOption, bool reverse, CancellationToken cancellationToken, params object[] dynamics)
        {
            Guid? courseId = (Guid?)dynamics[0];
            return await _userContext.Users.GetListAsync<User, UserDto>(
               _mapper,
               skip,
               take,
               u => u.Email.Contains(query.ToLower().Trim()) && (courseId == null || u.Courses.Any(c => c.Id == courseId)),
               sortOption,
               reverse,
               new() { },
               cancellationToken);
        }

        public async Task<List<UserDto>> GetListAll(string query,
            string sortOption, bool reverse, CancellationToken cancellationToken, params object[] dynamics)
        {
            Guid? courseId = (Guid?)dynamics[0];
            return await _userContext.Users.GetListAllAsync<User, UserDto>(
                  _mapper,
                  u => u.Email.Contains(query.ToLower().Trim()) && (courseId == null || u.Courses.Any(c => c.Id == courseId)),
                  sortOption,
                  reverse,
                  new() { },
                  cancellationToken);
        }

        public async Task<User> GetByIdAsync(Guid id, CancellationToken cancellationToken)
            => await _userContext.Users.GetAsync(_mapper,
                x => x.Id == id, new() { x => x.Roles }, cancellationToken);

        public async Task<UserDetailsDto> GetShortInfoByIdAsync(Guid id, CancellationToken cancellationToken)
            => _mapper.Map<UserDetailsDto>(await GetByIdAsync(id, cancellationToken));

        public async Task<User> GetByEmailAsync(string email, CancellationToken cancellationToken)
            => await _userContext.Users.GetAsync(_mapper,
                x => x.Email == email, new() { x => x.Roles }, cancellationToken);

        public async Task<Guid> GetIdFromEmail(string email, CancellationToken cancellationToken)
            => (await GetUserDtoByEmail(email, cancellationToken)).Id;

        private async Task<UserDto> GetUserDtoByEmail(string email, CancellationToken cancellationToken)
            => await _userContext.Users.ProjectTo<UserDto>
            (_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Email == email, cancellationToken);

        public async Task<Guid> CreateAsync(RegisterUserModel model, CancellationToken cancellationToken)
        {
            if (await _userContext.Users.SingleOrDefaultAsync(u =>
                 u.Email == model.Email, cancellationToken) != null)
                throw new ConflictException($"User with this email ({model.Email}) already exists");

            var user = _mapper.Map<User>(model);

            user.Id = Guid.NewGuid();

            var role = await _roleContext.Roles
                .FirstOrDefaultAsync(r =>
                r.Name == "User", cancellationToken);

            user.Roles = new List<Role> { role };
            user.Rating = default;
            user.Salt = Hasher.GenerateSalt(saltSize);
            user.Password = Hasher.GetSaltedHash(user.Password, user.Salt);

            await _userContext.Users.AddAsync(user, cancellationToken);
            await _userContext.SaveChangesAsync(cancellationToken);

            return user.Id;

        }

        public async Task UpdateAsync(Guid id, RegisterUserModel model, CancellationToken cancellationToken)
        {
            var user = await _userContext.Users.GetAsync(_mapper,
                u => u.Id == id, new() { }, cancellationToken);

            if (!string.IsNullOrEmpty(model.Email) && model.Email != user.Email)
            {
                if (await _userContext.Users.AnyAsync(u => u.Email == model.Email, cancellationToken))
                    throw new AlreadyExistsException(nameof(User), nameof(model.Email), model.Email);
                user.Email = model.Email;
            }

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.UserName = model.UserName;

            if (!string.IsNullOrEmpty(model.Password)) 
                user.Password = Hasher.GetSaltedHash(model.Password, user.Salt);

            _userContext.Users.Update(user);

            await _userContext.SaveChangesAsync(cancellationToken);
        }


        public async Task PartlyUpdateAsync(Guid id, UpdateUserModel model, CancellationToken cancellationToken)
        {
            var user = await _userContext.Users.GetAsync(_mapper,
                u => u.Id == id, new() { }, cancellationToken);

            if (!string.IsNullOrEmpty(model.Email) && model.Email != user.Email)
            {
                if (await _userContext.Users.AnyAsync(u => u.Email == model.Email, cancellationToken))
                    throw new AlreadyExistsException(nameof(User), nameof(model.Email), model.Email);
                user.Email = model.Email;
            }

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.UserName = model.UserName;

            _userContext.Users.Update(user);

            await _userContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<string> UpdateImageAsync(Guid id, IFormFile file,
            int width, int height, CancellationToken cancellationToken)
        {
            var user = await _userContext.Users.GetAsync(_mapper,
                x => x.Id == id, new() { }, cancellationToken);

            if (!file.ContentType.Contains("image"))
                throw new ConflictException("Not supported image format");

            user.ImageUrl = await _cloudinaryService
                .UploadImageAsync(file, user.Id.ToString(), width, height);

            _userContext.Users.Update(user);
            await _userContext.SaveChangesAsync(cancellationToken);
            return user.ImageUrl;
        }

        public async Task DeleteByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            var user = await _userContext.Users.GetAsync(_mapper,
                u => u.Id == id, new() { }, cancellationToken);

            var courses = await _courseDbContext.Courses
                .Where(c => c.CreatorId == id)
                .ToListAsync(cancellationToken);

            await _cloudinaryService.DeleteAsync(user.ImageUrl);

            foreach (var course in courses)
                await _cloudinaryService.DeleteAsync(course.ImageUrl);

            _courseDbContext.Courses.RemoveRange(courses);
            _userContext.Users.Remove(user);

            await _userContext.SaveChangesAsync(cancellationToken);   
        }

        

    }
}
