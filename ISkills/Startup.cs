using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.Cookies;
using DAL;
using Domain.Interfaces;
using BLL.Mapping;
using System.Reflection;
using BLL;
using BLL.Interfaces;
using ISkills.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using System.IO;

namespace ISkills
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Env = env;
        }


        private IConfiguration Configuration { get; }
        private readonly IWebHostEnvironment Env;

        
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAutoMapper(config =>
            {
                config.AddProfile(new AssemblyMappingProfile(typeof(IUserRepository).Assembly));

            });

            services.AddApplication(Env.IsDevelopment());
            services.AddPersistence(Configuration);

            services.AddControllers()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                })
                .AddFluentValidation(options => {
                    options.RegisterValidatorsFromAssemblyContaining<Startup>();
                    options.DisableDataAnnotationsValidation = false;
                });
            services.AddSwaggerGen();




            services.AddCors(options =>
            {
                options.AddPolicy(name: "MyCors",
                     builder =>
                     {
                         builder
                         .AllowAnyOrigin()
                         .AllowAnyHeader()
                         .AllowAnyMethod()
                         .WithExposedHeaders("X-Total-Count");
                     });
            });

            services.AddControllersWithViews();
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

       
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseStaticFiles();
            app.UseCustomExceptionHandler();
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseHttpsRedirection();
            app.UseCors("MyCors");

            app.UseAuthentication();
            app.UseAuthorization();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSpa(spa =>
                spa.Options.SourcePath = "wwwroot"
            );
        }
    }
}
