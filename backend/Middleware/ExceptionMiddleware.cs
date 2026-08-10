using System.Net;
using System.Text.Json;

namespace SchollegeMS.Backend.Middleware
{
    /// <summary>
    /// Global exception middleware that maps exception types to stable HTTP responses.
    /// Returns a consistent error shape: { "message": "...", "errors": {} }
    /// Never logs passwords or JWTs.
    /// </summary>
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            var userId = context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "anonymous";
            _logger.LogError(ex,
                "Unhandled exception. Path: {Path}, Method: {Method}, UserId: {UserId}",
                context.Request.Path, context.Request.Method, userId);

            var (statusCode, message) = ex switch
            {
                UnauthorizedAccessException => (HttpStatusCode.Forbidden, ex.Message),
                KeyNotFoundException         => (HttpStatusCode.NotFound, ex.Message),
                ArgumentException            => (HttpStatusCode.BadRequest, ex.Message),
                InvalidOperationException    => (HttpStatusCode.BadRequest, ex.Message),
                _                            => (HttpStatusCode.InternalServerError, "An unexpected error occurred.")
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var response = new { message = message, errors = new { } };
            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            await context.Response.WriteAsync(json);
        }
    }

    public static class ExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app)
            => app.UseMiddleware<ExceptionMiddleware>();
    }
}
