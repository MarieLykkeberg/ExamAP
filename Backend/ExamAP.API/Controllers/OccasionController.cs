using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ExamAP.Model.Repositories;
using ExamAP.Model.Entities;
using ExamAP.API.Dtos;

namespace ExamAP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OccasionController : ControllerBase
    {
        private readonly OccasionRepository _repository;

        public OccasionController(OccasionRepository repository)
        {
            _repository = repository;
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult<IEnumerable<Occasion>> GetOccasions()
        {
            var occasions = _repository.GetAllOccasions();  // Fetch all colors from the repository
            return Ok(occasions);
        }

        [Authorize]
        [HttpPost]
        public IActionResult AddOccasion([FromBody] NameDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            var success = _repository.InsertOccasion(dto.Name);
            if (!success)
                return StatusCode(500, "Failed to insert occasion.");

            return Ok();
        }
    }
}
