using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using BCrypt.Net;

namespace Backend.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ITokenService _tokenService;

    public AuthController(AppDbContext db, ITokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || dto.Username.Length < 3 || dto.Username.Length > 50)
            return BadRequest("Username must be 3-50 chars");
        if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
            return BadRequest("Password must be >=6 chars");

        if (_db.Users.Any(u => u.Username == dto.Username))
            return BadRequest("Username already exists");

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email
        };
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _tokenService.CreateToken(user);
        return Ok(new AuthResponseDto(token, user.Username, user.Email));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = _db.Users.FirstOrDefault(u => u.Username == dto.UsernameOrEmail || u.Email == dto.UsernameOrEmail);
        if (user == null) return Unauthorized("Invalid credentials");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials");

        var token = _tokenService.CreateToken(user);
        return Ok(new AuthResponseDto(token, user.Username, user.Email));
    }
}
