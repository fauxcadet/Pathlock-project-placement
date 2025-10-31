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
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProjectsController(AppDbContext db) => _db = db;

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? "0");

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        var userId = GetUserId();
        var projects = await _db.Projects
            .Where(p => p.UserId == userId)
            .Select(p => new ProjectDto(p.Id, p.Title, p.Description, p.CreatedAt))
            .ToListAsync();
        return Ok(projects);
    }

    [HttpPost]
    public async Task<IActionResult> Create(ProjectCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Length < 3 || dto.Title.Length > 100)
            return BadRequest("Title length 3-100 chars");

        var userId = GetUserId();
        var p = new Project { Title = dto.Title, Description = dto.Description, UserId = userId, CreatedAt = DateTime.UtcNow };
        _db.Projects.Add(p);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProjects), new { id = p.Id }, new ProjectDto(p.Id, p.Title, p.Description, p.CreatedAt));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var proj = await _db.Projects.Include(p => p.Tasks).FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        if (proj == null) return NotFound();
        _db.Tasks.RemoveRange(proj.Tasks);
        _db.Projects.Remove(proj);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}")]
public async Task<IActionResult> UpdateProject(int id, ProjectCreateDto dto)
{
    var userId = GetUserId();
    var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
    if (project == null) return NotFound();

    if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Length < 3)
        return BadRequest("Title is required");

    project.Title = dto.Title;
    project.Description = dto.Description;
    await _db.SaveChangesAsync();

    return Ok(new ProjectDto(project.Id, project.Title, project.Description, project.CreatedAt));
}

}
