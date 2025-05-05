using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ExamAP.Model.Repositories;
using ExamAP.Model.Entities;
using ExamAP.API.Dtos;

namespace ExamAP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BrandController : ControllerBase
    {
        private readonly BrandRepository _repository;

        public BrandController(BrandRepository repository)
        {
            _repository = repository;
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult<IEnumerable<Brand>> GetBrands()
        {
            var brands = _repository.GetAllBrands();  // Fetch all brands from the repository
            return Ok(brands);
        }

        [Authorize]
        [HttpPost]
        public IActionResult AddBrand([FromBody] NameDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            var success = _repository.InsertBrand(dto.Name);
            if (!success)
                return StatusCode(500, "Failed to insert brand.");

            return Ok();
        }
    }
}
