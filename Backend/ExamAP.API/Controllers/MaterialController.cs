using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ExamAP.Model.Repositories;
using ExamAP.Model.Entities;
using ExamAP.API.Dtos;

namespace ExamAP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaterialController : ControllerBase
    {
        private readonly MaterialRepository _repository;

        public MaterialController(MaterialRepository repository)
        {
            _repository = repository;
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult<IEnumerable<Material>> GetMaterials()
        {
            var materials = _repository.GetAllMaterials();  // Fetch all colors from the repository
            return Ok(materials);
        }

        [Authorize]
        [HttpPost]
        public IActionResult AddMaterial([FromBody] NameDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            var success = _repository.InsertMaterial(dto.Name);
            if (!success)
                return StatusCode(500, "Failed to insert material.");

            return Ok();
        }
    }
}
