using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ExamAP.Model.Repositories;
using ExamAP.Model.Entities;

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
    }
}
