namespace Backend.DTOs;
public record RegisterDto(string Username, string Email, string Password);
public record LoginDto(string UsernameOrEmail, string Password);
public record AuthResponseDto(string Token, string Username, string Email);
