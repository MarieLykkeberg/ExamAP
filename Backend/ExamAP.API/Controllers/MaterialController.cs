using Microsoft.AspNetCore.Mvc;
using ExamAP.Model.Repositories;
using ExamAP.Model.Entities;

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

        [HttpGet]
        public ActionResult<IEnumerable<Material>> GetMaterials()
        {
            var materials = _repository.GetAllMaterials();  // Fetch all colors from the repository
            return Ok(materials);
        }
    }
}
