using ExamAP.Model.Entities;
using ExamAP.Model.Repositories;
using Microsoft.AspNetCore.Mvc;
using ExamAP.API.Dtos;

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
            Name     = dto.Name,
            Email    = dto.Email,
            Password = dto.Password
        };

        bool status = Repository.InsertUser(user);
            if (status)
            {
                Console.WriteLine("User registration successful");
                return new JsonResult(new { message = "User registered successfully" });
            }

        Console.WriteLine("User registration failed");
        return BadRequest("Something went wrong while registering the user.");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            Console.WriteLine($"Login attempt:");
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
            return new JsonResult(new { message = "Login successful", email = existingUser.Email });
        }
    }
}