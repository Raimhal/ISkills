using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using FluentValidation;
using BLL.Interfaces;
using BLL.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using BLL.Tasks;

namespace BLL
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services, bool isDevelopment)
        {
            services.AddValidatorsFromAssemblies(new[] { Assembly.GetExecutingAssembly() });

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IFileRepository, FileRepository>();
            services.AddScoped<IAccessRepository, AccessRepository>();
            services.AddScoped<ICourseService, CourseRepository>();
            services.AddScoped<IThemeRepository, ThemeRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ICommentRepository, CommentRepository>();
            services.AddScoped<IChapterRepository, ChapterRepository>();
            services.AddScoped<IVideoRepository, VideoRepository>();
            services.AddScoped<IAntivirusService, AntivirusService>();
            services.AddScoped<IDatabaseService, DatabaseService>();
            services.AddTransient<ICloudinaryService, CloudinaryService>();

            if (!isDevelopment)
            {
                services.AddSingleton<AutoBackupService>();
                services.AddHostedService<AutoBackupService>();
            }

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
