using Microsoft.AspNetCore.Mvc;
using ExamAP.Model.Repositories;
using ExamAP.Model.Entities;

namespace ExamAP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ColorController : ControllerBase
    {
        private readonly ColorRepository _repository;

        public ColorController(ColorRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Color>> GetColors()
        {
            var colors = _repository.GetAllColors();  // Fetch all colors from the repository
            return Ok(colors);
        }
    }
}
