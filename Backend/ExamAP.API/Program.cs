using ExamAP.Model.Repositories;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;
using ExamAP.API.Middleware;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

// CORS for Angular
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy
          .WithOrigins("http://localhost:4200")
          .AllowAnyHeader()
          .AllowAnyMethod();
    });
});

// MVC Controllers
builder.Services.AddControllers();

// Your repositories
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<ItemRepository>();
builder.Services.AddScoped<ColorRepository>();
builder.Services.AddScoped<CategoryRepository>();
builder.Services.AddScoped<MaterialRepository>();
builder.Services.AddScoped<OccasionRepository>();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo {
      Title = "ExamAP API",
      Version = "v1",
      Description = "API for the ExamAP application"
    });
});

builder.Services.AddAuthentication("Basic"); 

var app = builder.Build();

// Enable middleware
app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);

app.UseBasicAuthenticationMiddleware();
app.UseAuthentication();
app.UseAuthorization();

// Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ExamAP API V1");
    c.RoutePrefix = string.Empty; // serve UI at root if you like
});

// Static files (Uploads)
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Uploads")
    ),
    RequestPath = "/Uploads"
});

// Map your controllers
app.MapControllers();

app.Run();


