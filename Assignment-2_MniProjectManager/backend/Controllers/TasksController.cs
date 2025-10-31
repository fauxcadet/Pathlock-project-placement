using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;


namespace Backend.Controllers;
[ApiController]
[Route("api")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;
    public TasksController(AppDbContext db) => _db = db;

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? "0");

    [HttpGet("projects/{projectId}/tasks")]
    public async Task<IActionResult> GetTasks(int projectId)
    {
        var userId = GetUserId();
        var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
        if (project == null) return NotFound();

        var tasks = await _db.Tasks
            .Where(t => t.ProjectId == projectId)
            .Select(t => new TaskDto(t.Id, t.Title, t.DueDate, t.IsCompleted, t.ProjectId))
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpPost("projects/{projectId}/tasks")]
    public async Task<IActionResult> CreateTask(int projectId, TaskCreateDto dto)
    {
        var userId = GetUserId();
        var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
        if (project == null) return NotFound();

        if (string.IsNullOrWhiteSpace(dto.Title))
            return BadRequest("Task title required");

        var t = new TaskItem { Title = dto.Title, DueDate = dto.DueDate, ProjectId = projectId, IsCompleted = false };
        _db.Tasks.Add(t);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTasks), new { projectId }, new TaskDto(t.Id, t.Title, t.DueDate, t.IsCompleted, t.ProjectId));
    }

    [HttpPut("tasks/{id}/toggle")]
    public async Task<IActionResult> Toggle(int id)
    {
        var userId = GetUserId();
        var task = await _db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == id && t.Project!.UserId == userId);
        if (task == null) return NotFound();
        task.IsCompleted = !task.IsCompleted;
        await _db.SaveChangesAsync();
        return Ok(new TaskDto(task.Id, task.Title, task.DueDate, task.IsCompleted, task.ProjectId));
    }

    [HttpPut("tasks/{id}")]
public async Task<IActionResult> UpdateTask(int id, TaskCreateDto dto)
{
    var userId = GetUserId();
    var task = await _db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == id && t.Project!.UserId == userId);
    if (task == null) return NotFound();

    if (string.IsNullOrWhiteSpace(dto.Title))
        return BadRequest("Task title required");

    task.Title = dto.Title;
    task.DueDate = dto.DueDate;
    await _db.SaveChangesAsync();

    return Ok(new TaskDto(task.Id, task.Title, task.DueDate, task.IsCompleted, task.ProjectId));
}


    [HttpDelete("tasks/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var task = await _db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == id && t.Project!.UserId == userId);
        if (task == null) return NotFound();

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return NoContent();
    }
    [HttpPost("projects/{projectId}/schedule")]
public async Task<IActionResult> AutoSchedule(int projectId, [FromBody] ScheduleRequestDto dto)
{
    var userId = GetUserId();
    var project = await _db.Projects
        .Include(p => p.Tasks)
        .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
    if (project == null) return NotFound("Project not found");

    var startDate = dto.StartDate ?? DateTime.Now;
    int dayOffset = 0;

    foreach (var task in project.Tasks.OrderBy(t => t.Id))
    {
        task.DueDate = startDate.AddDays(dayOffset);
        dayOffset++;
    }

    await _db.SaveChangesAsync();
    return Ok(new
    {
        projectId,
        scheduledTasks = project.Tasks.Select(t => new
        {
            t.Id,
            t.Title,
            t.DueDate
        })
    });
}

public record ScheduleRequestDto(DateTime? StartDate, int WorkHoursPerDay = 6);

}
