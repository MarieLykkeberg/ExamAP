using System.Text;
using Microsoft.AspNetCore.Authorization;
using ExamAP.Model.Repositories;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.Extensions.Options;
using ExamAP.API.Middleware;

namespace ExamAP.API.Middleware;

public class BasicAuthenticationMiddleware
{
    private readonly RequestDelegate _next;

    public BasicAuthenticationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, UserRepository userRepository)
    {
        // Allow Swagger UI and Swagger JSON requests without authentication
        if (context.Request.Path.StartsWithSegments("/swagger") ||
            context.Request.Path.StartsWithSegments("/") ||
            context.GetEndpoint()?.Metadata.GetMetadata<IAllowAnonymous>() != null)
        {
            await _next(context);
            return;
        }

        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

        if (authHeader == null || !authHeader.StartsWith("Basic "))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Authorization header missing or invalid.");
            return;
        }

        try
        {
            // Use AuthenticationHelper to extract credentials
            AuthenticationHelper.Decrypt(authHeader, out string username, out string password);

            var user = userRepository.GetUserByCredentials(username, password);
            if (user == null)
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Incorrect credentials.");
                return;
            }

            // Add claims so controller can access them
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            };
            var identity = new ClaimsIdentity(claims, "Basic");
            context.User = new ClaimsPrincipal(identity);

            await _next(context);
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Invalid authorization header format.");
            return;
        }
    }
}

public static class BasicAuthenticationMiddlewareExtensions
{
    public static IApplicationBuilder UseBasicAuthenticationMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<BasicAuthenticationMiddleware>();
    }
}

