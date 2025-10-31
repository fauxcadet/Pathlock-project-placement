using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// ✅ Enable CORS for frontend (Vite on port 5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// ✅ Apply the CORS policy
app.UseCors("AllowFrontend");

// ✅ In-memory task list (no database)
var tasks = new List<TaskItem>
{
    new() { Id = 1, Description = "Sample task", IsCompleted = false }
};

// ✅ GET /api/tasks — fetch all tasks
app.MapGet("/api/tasks", () => tasks);

// ✅ POST /api/tasks — create a new task
app.MapPost("/api/tasks", (TaskCreateDto newTask) =>
{
    var nextId = tasks.Count > 0 ? tasks.Max(t => t.Id) + 1 : 1;
    var task = new TaskItem
    {
        Id = nextId,
        Description = newTask.Description,
        IsCompleted = false
    };
    tasks.Add(task);
    return Results.Created($"/api/tasks/{task.Id}", task);
});

// ✅ PUT /api/tasks/{id}/toggle — toggle completion status
app.MapPut("/api/tasks/{id}/toggle", (int id) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    if (task is null)
        return Results.NotFound();

    task.IsCompleted = !task.IsCompleted;
    return Results.Ok(task);
});

// ✅ DELETE /api/tasks/{id} — remove a task
app.MapDelete("/api/tasks/{id}", (int id) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    if (task is null)
        return Results.NotFound();

    tasks.Remove(task);
    return Results.Ok();
});

app.Run();

// ✅ Data Models
public class TaskItem
{
    public int Id { get; set; }
    public string Description { get; set; } = "";
    public bool IsCompleted { get; set; }
}

public class TaskCreateDto
{
    public string Description { get; set; } = "";
}
