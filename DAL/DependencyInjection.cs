﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Domain.Interfaces;
using BLL.Interfaces;
using Azure.Storage.Blobs;
using System;

namespace DAL
{
    public static class DependencyInjection 
    {
        public static IServiceCollection AddPersistence(this IServiceCollection services,
            IConfiguration configuration)
        {
            //services.AddDbContext<IskillsContext>(options =>
            //    options.UseNpgsql(configuration.GetConnectionString("DbConnection")));

            var connectionString = $"host={Environment.GetEnvironmentVariable("POSTGRES_HOST")};" +
                $"port={Environment.GetEnvironmentVariable("POSTGRES_PORT")};" +
                $"database={Environment.GetEnvironmentVariable("POSTGRES_DB")};" +
                $"username={Environment.GetEnvironmentVariable("POSTGRES_USER")};" +
                $"password={Environment.GetEnvironmentVariable("POSTGRES_PASSWORD")};";

            services.AddDbContext<IskillsContext>(options =>
                options.UseNpgsql(connectionString));

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
            services.AddScoped<IRefreshTokenDbContext>(provider =>
                provider.GetService<IskillsContext>());

            services.AddSingleton(x => new BlobServiceClient
            (
                configuration.GetConnectionString("BlobServiceConnection")
            ));

            return services;
        }
    }
}
