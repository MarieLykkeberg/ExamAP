using System.Text;
using Microsoft.AspNetCore.Authorization;
using ExamAP.Model.Repositories;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.Extensions.Options;
using ExamAP.API.Helpers;

namespace ExamAP.API.Middleware;

public class BasicAuthenticationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IServiceScopeFactory _scopeFactory;

    public BasicAuthenticationMiddleware(RequestDelegate next, IServiceScopeFactory scopeFactory)
    {
        _next = next;
        _scopeFactory = scopeFactory;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.GetEndpoint()?.Metadata.GetMetadata<IAllowAnonymous>() != null)
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
            string username;
            string password;
            AuthenticationHelper.Decrypt(authHeader, out username, out password);

            using (var scope = _scopeFactory.CreateScope())
            {
                var userRepository = scope.ServiceProvider.GetRequiredService<UserRepository>();
                var user = userRepository.GetUserByCredentials(username, password);

                if (user == null)
                {
                    Console.WriteLine("User not found or password incorrect.");
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Incorrect credentials.");
                    return;
                }

                Console.WriteLine("User authenticated successfully.");

                // Add claims so controller can access them
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Name, user.Email)
                };
                var identity = new ClaimsIdentity(claims, "Basic");
                context.User = new ClaimsPrincipal(identity);  // Now available via `User.FindFirst(...)`

                await _next(context);
            }
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

