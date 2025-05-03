using System;
using System.Linq;
using ExamAP.Model.Entities;
using ExamAP.Model.Repositories;
using ExamAP.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult RegisterUser([FromBody] RegisterDto dto)
        {
            Console.WriteLine($"Received registration for: Name={dto.Name}, Email={dto.Email}");
            if (dto == null
                || string.IsNullOrWhiteSpace(dto.Name)
                || string.IsNullOrWhiteSpace(dto.Email)
                || string.IsNullOrWhiteSpace(dto.Password))
            {
                Console.WriteLine("Bad user data");
                return BadRequest("Name, Email and Password are all required.");
            }

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = dto.Password
            };

            bool status = Repository.InsertUser(user);
            if (status)
            {
                Console.WriteLine("User registration successful");
                return Ok(new { message = "User registered successfully" });
            }

            Console.WriteLine("User registration failed");
            return BadRequest("Something went wrong while registering the user.");
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public ActionResult<User> Login([FromBody] LoginDto dto)
        {
            Console.WriteLine("Login attempt:");
            Console.WriteLine($"Email: {dto.Email}");
            Console.WriteLine($"Password: {dto.Password}");

            if (dto == null
                || string.IsNullOrWhiteSpace(dto.Email)
                || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            var existingUser = Repository.GetUserByCredentials(dto.Email, dto.Password);
            if (existingUser == null)
            {
                Console.WriteLine("No matching user found.");
                return Unauthorized("Invalid email or password");
            }

            Console.WriteLine("Login successful!");
            // ← return the full User object
            return Ok(existingUser);
        }

        [Authorize]
        [HttpGet("me")]
        public ActionResult<User> GetCurrentUser()
        {
            var sub = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            if (sub == null)
                return Unauthorized();

            if (!Int32.TryParse(sub, out var userId))
                return BadRequest("Invalid user id in token");

            var user = Repository.GetUserById(userId);
            if (user == null)
                return NotFound($"User {userId} not found");

            return Ok(user);
        }
    

    [HttpGet("{id}")]
        public ActionResult<User> GetUserById(int id)
        {
            var user = Repository.GetUserById(id);
            if (user == null)
                return NotFound($"User {id} not found.");
            return Ok(user);
        }
    }
}