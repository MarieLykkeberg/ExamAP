using ExamAP.Model.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ✅ Define named policy
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // optional, can remove if not using cookies
    });
});

builder.Services.AddControllers();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);
builder.Services.AddScoped<BottomRepository>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseHttpsRedirection();

// ✅ Apply the CORS policy here BEFORE anything else
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();
app.Run();
