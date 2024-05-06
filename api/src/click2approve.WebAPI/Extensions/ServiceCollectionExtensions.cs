using System.Net;
using System.Net.Mail;
using click2approve.WebAPI.Models;
using click2approve.WebAPI.Services;
using FluentEmail.Core.Interfaces;
using FluentEmail.Smtp;
using Hangfire;
using Hangfire.MemoryStorage;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;

namespace click2approve.WebAPI.Extensions;

/// <summary>
/// Extends IServiceCollection interface.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds and configures AuthN/Z services to the service collection.
    /// </summary>
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication();
        services.AddAuthorization();
        services.AddIdentityApiEndpoints<AppUser>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequiredLength = configuration.GetValue<int>("Identity:Password:RequiredLength");
                options.SignIn.RequireConfirmedEmail = configuration.GetValue<bool>("EmailSettings:EmailServiceIsEnabled");
                options.Lockout.MaxFailedAccessAttempts = configuration.GetValue<int>("Identity:Lockout:MaxFailedAccessAttempts");
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(configuration.GetValue<int>("Identity:Lockout:LockoutTimeSpanInMinutes"));
                options.Lockout.AllowedForNewUsers = configuration.GetValue<bool>("Identity:Lockout:AllowedForNewUsers");
            })
            .AddEntityFrameworkStores<ApiDbContext>();
        return services;
    }

    /// <summary>
    /// Adds and configures Hangfire services to the service collection.
    /// </summary>
    public static void AddHangfireServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHangfire(config =>
        {
            config.UseMemoryStorage()
                .WithJobExpirationTimeout(TimeSpan.FromMinutes(configuration.GetValue<int>("Hangfire:JobExpirationTimeoutMin")));
        });
        services.AddHangfireServer();
    }

    /// <summary>
    /// Adds and configures Email services to the service collection.
    /// </summary>
    public static void AddEmailServices(this IServiceCollection services, IConfiguration configuration)
    {
        var emailSettings = configuration.GetSection("EmailSettings");
        var emailServiceIsEnabled = emailSettings.GetValue<bool>("EmailServiceIsEnabled");
        if (!emailServiceIsEnabled)
        {
            services.AddTransient<IEmailService, EmailServiceStub>();
        }
        else
        {
            var defaultFromEmail = emailSettings["DefaultFromEmail"];
            var host = emailSettings["Host"];
            var port = emailSettings.GetValue<int>("Port");
            services.AddFluentEmail(defaultFromEmail);
            var username = emailSettings["Username"];
            var password = emailSettings["Password"];
            services.AddTransient<ISender>(x =>
                new SmtpSender(new SmtpClient(host, port)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential
                    {
                        UserName = username,
                        Password = password
                    }
                }));
            services.AddTransient<IEmailService, EmailService>();
        }
        services.AddTransient<IEmailSender<AppUser>, EmailSender>();
    }

    /// <summary>
    /// Adds and configures Swagger services to the service collection.
    /// </summary>
    public static void AddSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Version = "v1",
                Title = "Click2approve API Specification",
            });
            options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, "ApiSpecification.XML"));
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter access token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "bearer"
            });
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
            });
        });
    }
}
