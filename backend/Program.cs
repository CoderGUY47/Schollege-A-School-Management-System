using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SchollegeMS.Backend.Data;
using SchollegeMS.Backend.Middleware;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ─── 1. Database Context — PostgreSQL via Supabase ────────────────────────────
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? throw new InvalidOperationException("No database connection string configured.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// ─── 2. JWT Authentication ─────────────────────────────────────────────────────
var jwtKey    = builder.Configuration["Jwt:Secret"]  ?? Environment.GetEnvironmentVariable("JWT_SECRET")
    ?? throw new InvalidOperationException("Jwt:Secret is not configured.");
var jwtIssuer  = builder.Configuration["Jwt:Issuer"]  ?? "SchollegeMS.Backend";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "SchollegeMS.Frontend";

var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken            = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey         = new SymmetricSecurityKey(key),
        ValidateIssuer           = true,
        ValidIssuer              = jwtIssuer,
        ValidateAudience         = true,
        ValidAudience            = jwtAudience,
        ValidateLifetime         = true,
        RoleClaimType            = System.Security.Claims.ClaimTypes.Role
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdmin",   policy => policy.RequireRole("ADMIN"));
    options.AddPolicy("RequireTeacher", policy => policy.RequireRole("TEACHER", "ADMIN"));
    options.AddPolicy("RequireStudent", policy => policy.RequireRole("STUDENT", "TEACHER", "ADMIN"));
});

// ─── 3. CORS — restricted to frontend origin ──────────────────────────────────
var frontendUrl = builder.Configuration["FrontendUrl"]
    ?? Environment.GetEnvironmentVariable("FRONTEND_URL")
    ?? "http://localhost:3000";

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(frontendUrl, "https://schollege-portal.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ─── 4. Swagger / OpenAPI ─────────────────────────────────────────────────────
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title       = "Schollege MS — Assignment & Submission API",
        Version     = "v1",
        Description = "Role-Based Assignment & Submission Management API. JWT Bearer required for protected endpoints."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using Bearer scheme. Example: \"Bearer {token}\"",
        Name        = "Authorization",
        In          = ParameterLocation.Header,
        Type        = SecuritySchemeType.ApiKey,
        Scheme      = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ─── Ensure Database is Created & Seeded ──────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// ─── Middleware Pipeline ───────────────────────────────────────────────────────
app.UseGlobalExceptionHandler();   // must be first

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Schollege MS API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
