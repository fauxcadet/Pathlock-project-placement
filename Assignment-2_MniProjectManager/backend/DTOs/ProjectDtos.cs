namespace Backend.DTOs;
public record ProjectCreateDto(string Title, string? Description);
public record ProjectDto(int Id, string Title, string? Description, DateTime CreatedAt);
