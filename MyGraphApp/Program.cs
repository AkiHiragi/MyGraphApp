using MyGraphApp.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<MathService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Graph API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowReact");
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "Graph API is running! Visit /swagger for API documentation.");

app.Run();