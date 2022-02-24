using Microsoft.Extensions.DependencyInjection;
using MediatR;
using System.Reflection;
using FluentValidation;
using BLL.Interfaces;
using BLL.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace BLL
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddMediatR(Assembly.GetExecutingAssembly());
            services.AddValidatorsFromAssemblies(new[] { Assembly.GetExecutingAssembly(), typeof(IUserService).Assembly });
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IFileSettingsService, FileSettingsService>();
            services.AddScoped<IAccessService, AccessService>();
            services.AddScoped<ICourseService, CourseService>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = AuthOptions.ISSUER,
                        ValidateAudience = true,
                        ValidAudience = AuthOptions.AUDIENCE,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
                        RequireExpirationTime = true,
                    };

                });
            return services;
        }
    }
}
