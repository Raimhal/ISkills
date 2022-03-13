using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Domain.Interfaces;
using BLL.Interfaces;

namespace DAL
{
    public static class DependencyInjection 
    {
        public static IServiceCollection AddPersistence(this IServiceCollection services,
            IConfiguration configuration)
        {

            services.AddDbContext<IskillsContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DbConnection")));

            services.AddScoped<IUserDbContext>(provider =>
                provider.GetService<IskillsContext>());
            services.AddScoped<IRoleDbContext>(provider =>
                provider.GetService<IskillsContext>());
            services.AddScoped<IAllowedFileTypeDbContext>(provider =>
                provider.GetService<IskillsContext>());
            services.AddScoped<ICourseDbContext>(provider =>
                provider.GetService<IskillsContext>());
            services.AddScoped<IThemeDbContext>(provider =>
                provider.GetService<IskillsContext>());
            services.AddScoped<ICategoryDbContext>(provider =>
                provider.GetService<IskillsContext>());
            services.AddScoped<IChapterDbContext>(provider =>
                provider.GetService<IskillsContext>());
            services.AddScoped<IVideoDbContext>(provider =>
                provider.GetService<IskillsContext>());
            services.AddScoped<ICommentDbContext>(provider =>
                provider.GetService<IskillsContext>());


            return services;
        }
    }
}
