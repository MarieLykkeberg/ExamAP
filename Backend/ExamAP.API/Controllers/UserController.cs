using System;
using System.Linq;
using ExamAP.Model.Entities;
using ExamAP.Model.Repositories;
using ExamAP.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExamAP.API.Helpers;

namespace ExamAP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserRepository Repository;

        public UserController(UserRepository repository)
        {
            Repository = repository;
        }

        // ── Registration ────────────────────────────────────────
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult RegisterUser([FromBody] RegisterDto dto)
        {
            if (dto == null
                || string.IsNullOrWhiteSpace(dto.Name)
                || string.IsNullOrWhiteSpace(dto.Email)
                || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Name, Email and Password are all required.");
            }

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = dto.Password
            };

            bool status = Repository.InsertUser(user);
            if (status) return Ok(new { message = "User registered successfully" });
            return BadRequest("Something went wrong while registering the user.");
        }

        // ── Login ────────────────────────────────────────────────
        [AllowAnonymous]
        [HttpPost("login")]
        public ActionResult<User> Login([FromBody] LoginDto dto)
        {
            if (dto == null
                || string.IsNullOrWhiteSpace(dto.Email)
                || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            var existingUser = Repository.GetUserByCredentials(dto.Email, dto.Password);
            if (existingUser == null) return Unauthorized("Invalid email or password");

            // Generate auth header using AuthenticationHelper
            var authHeader = AuthenticationHelper.Encrypt(dto.Email, dto.Password);
            Response.Headers.Add("Authorization", authHeader);

            return Ok(existingUser);
        }

        // ── Get current user (from token) ───────────────────────
        [Authorize]
        [HttpGet("me")]
        public ActionResult<User> GetCurrentUser()
        {
            var sub = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            if (sub == null) return Unauthorized();
            if (!Int32.TryParse(sub, out var userId))
                return BadRequest("Invalid user id in token");

            var user = Repository.GetUserById(userId);
            if (user == null) return NotFound($"User {userId} not found");

            return Ok(user);
        }

        // ── Get any user by id ───────────────────────────────────
        [HttpGet("{id}")]
        public ActionResult<User> GetUserById(int id)
        {
            var user = Repository.GetUserById(id);
            if (user == null) return NotFound($"User {id} not found.");
            return Ok(user);
        }

        // ── UPDATE user (PUT /api/user/{id}) ─────────────────────
        [Authorize]
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] RegisterDto dto)
        {
            if (dto == null
                || string.IsNullOrWhiteSpace(dto.Name)
                || string.IsNullOrWhiteSpace(dto.Email)
                || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Name, Email and Password are all required.");
            }

            var existing = Repository.GetUserById(id);
            if (existing == null) return NotFound($"User {id} not found.");

            existing.Name     = dto.Name;
            existing.Email    = dto.Email;
            existing.Password = dto.Password;

            bool success = Repository.UpdateUser(existing);
            if (!success) return StatusCode(500, "Failed to update user.");

            return NoContent();  // HTTP 204
        }

        // ── DELETE user (DELETE /api/user/{id}) ──────────────────
        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var existing = Repository.GetUserById(id);
            if (existing == null) return NotFound($"User {id} not found.");

            bool success = Repository.DeleteUser(id);
            if (!success) return StatusCode(500, "Failed to delete user.");

            return NoContent();  // HTTP 204
        }

    } // class UserController
} // namespace ExamAP.API.Controllers