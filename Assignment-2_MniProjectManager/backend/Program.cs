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

// 🚀 FINAL MODIFICATION: Implement custom SetIsOriginAllowed logic for robust Vercel CORS.
// This is the most reliable way to handle dynamic Vercel subdomains (e.g., *-kjwb.vercel.app).

var allowedOrigins = new List<string>
{
    "http://localhost:5173",
    "https://pathlock-project-placement.vercel.app",
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
            {
                // 1. Allow origins from the explicit list (localhost, primary domain)
                if (allowedOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase))
                {
                    return true;
                }

                // 2. Allow all subdomains of the Vercel project domain (wildcard logic)
                var vercelBase = ".pathlock-project-placement.vercel.app";
                
                if (origin.EndsWith(vercelBase, StringComparison.OrdinalIgnoreCase))
                {
                    // Ensure the scheme is HTTPS
                    return origin.StartsWith("https://", StringComparison.OrdinalIgnoreCase);
                }

                return false;
            })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
// -------------------------------------------------------------

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// ✅ Ensure database exists
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// 🚀 MODIFIED: Handle OPTIONS requests manually (fixes 502 preflight issues)
app.Use(async (context, next) =>
{
    // Capture the requested Origin header
    var origin = context.Request.Headers["Origin"].ToString();
    
    // Check if the request is an OPTIONS preflight
    if (context.Request.Method == "OPTIONS")
    {
        // Explicitly set the headers needed for the OPTIONS response
        // This bypasses the normal CORS middleware for preflight only.
        context.Response.Headers.Add("Access-Control-Allow-Origin", origin);
        context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
        return;
    }
    await next();
});
// -------------------------------------------------------------

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
