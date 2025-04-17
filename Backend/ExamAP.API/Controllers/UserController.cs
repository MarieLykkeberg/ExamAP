using ExamAP.Model.Entities;
using ExamAP.Model.Repositories;
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

       [HttpPost]
        public IActionResult RegisterUser([FromBody] User user)
        {
            Console.WriteLine("Received registration for: " + user.Email);

            if (user == null || string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
                {
                    Console.WriteLine("Bad user data");
                    return BadRequest("Invalid user data");
                }

    bool status = Repository.InsertUser(user);

        if (status)
        {
            Console.WriteLine("User registration successful");
            return new JsonResult(new { message = "User registered successfully" });
        }

        Console.WriteLine("User registration failed");
        return BadRequest("Something went wrong while registering the user.");
        }
    }
}