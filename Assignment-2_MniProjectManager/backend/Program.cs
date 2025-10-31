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
    options.RequireHttpsMetadata = false; // set true if using HTTPS in production
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

// ✅ CORS for both local + deployed frontends
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", p =>
    {
        p.WithOrigins(
            "http://localhost:5173",
            "https://pathlock-project-placement.vercel.app",   // Assignment 1 frontend
            "https://pathlock-miniprojectmanager.vercel.app",
         "https://pathlock-project-placement-git-bc15a5-souravs-projects-fe674b7a.vercel.app"    // Assignment 2 frontend
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// ✅ Ensure DB exists
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// ✅ Middleware order (important)
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ✅ Use Render's dynamic port (important!)
var port = Environment.GetEnvironmentVariable("PORT") ?? "10000";
app.Urls.Add($"http://*:{port}");

// ✅ Optional health check
app.MapGet("/", () => "✅ Backend running and healthy!");

// ✅ Start the app
app.Run();
