using Microsoft.AspNetCore.Authorization;
using ExamAP.Model.Repositories;
using System.Security.Claims;

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
    var path = context.Request.Path.Value?.ToLower();

    // skip auth on login/ regsiter page so user can put in login details
    if (path == "/api/user/login" || path == "/api/user/register")
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
        //use authenticationhelper to extract credentials
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
    catch (Exception)
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Invalid authorization header format.");
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

