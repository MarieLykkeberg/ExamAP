using System.Text;
using Microsoft.AspNetCore.Authorization;
using ExamAP.Model.Repositories;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.Extensions.Options;

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

        var encoded = authHeader.Substring("Basic ".Length).Trim();
        var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(encoded));
        var parts = decoded.Split(':');

        if (parts.Length != 2)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Invalid authorization header format.");
            return;
        }

        var username = parts[0];
        var password = parts[1];

        using (var scope = _scopeFactory.CreateScope())
        {
            var userRepository = scope.ServiceProvider.GetRequiredService<UserRepository>();
            var user = userRepository.GetUserByCredentials(username, password);

            if (user == null)
            {
                Console.WriteLine("🚫 User not found or password incorrect.");
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Incorrect credentials.");
                return;
            }

            Console.WriteLine("✅ User authenticated successfully.");

            await _next(context);
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

public class DummyHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public DummyHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock)
        : base(options, logger, encoder, clock)
    {}

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // We already authenticate in custom middleware
        var identity = new ClaimsIdentity("Basic");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "Basic");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}