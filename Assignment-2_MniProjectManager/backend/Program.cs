using Backend.Data;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ✅ Database (SQLite)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=plc.db"));

// ✅ Dependency Injection
builder.Services.AddScoped<ITokenService, TokenService>();

// ✅ JWT Authentication
var jwtSection = builder.Configuration.GetSection("Jwt");
var key = jwtSection["Key"] ?? "ReplaceThisWithASecretKeyForDev1234567890";
var issuer = jwtSection["Issuer"] ?? "plc.local";
var audience = jwtSection["Audience"] ?? "plc.local";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // true for HTTPS-only environments
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        ValidateLifetime = true
    };
});

// ✅ CORS setup — must explicitly list all frontend origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",                                     // local dev
                "https://pathlock-project-placement.vercel.app",              // Assignment 1
                "https://pathlock-miniprojectmanager.vercel.app",             // Assignment 2 (future)
                "https://pathlock-project-placement-kjwb.vercel.app"          // current frontend deployment
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// ✅ Ensure database exists
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// ✅ Handle OPTIONS requests manually (fixes 502 preflight issues)
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
        return;
    }
    await next();
});

// ✅ Correct middleware order (important!)
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

// ✅ Map API controllers
app.MapControllers();

// ✅ Health check endpoint
app.MapGet("/", () => Results.Ok("✅ Backend running and healthy!"));

// ✅ Render dynamic port binding
var port = Environment.GetEnvironmentVariable("PORT") ?? "10000";
app.Urls.Add($"http://*:{port}");

// ✅ Start the app
app.Run();
