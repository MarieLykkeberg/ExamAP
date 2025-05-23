using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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

        [AllowAnonymous]
        [HttpGet]
        public ActionResult<IEnumerable<Material>> GetMaterials()
        {
            var materials = _repository.GetAllMaterials();  // look up all materials in the database using the repository
            return Ok(materials);
        }
    }
}
