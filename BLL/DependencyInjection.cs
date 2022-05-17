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

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<IAccessService, AccessService>();
            services.AddScoped<ICourseService, CourseService>();
            services.AddScoped<IThemeService, ThemeService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<ICommentService, CommentService>();
            services.AddScoped<IChapterService, ChapterService>();
            services.AddScoped<IVideoService, VideoService>();
            services.AddScoped<IAntivirusService, AntivirusService>();
            services.AddScoped<IDatabaseService, DatabaseService>();
            services.AddTransient<ICloudinaryService, CloudinaryService>();

            //if (isDevelopment)
            //{
            //    services.AddSingleton<AutoBackupService>();
            //    services.AddHostedService<AutoBackupService>();
            //}

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
