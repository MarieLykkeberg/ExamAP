using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ExamAP.Model.Repositories;
using ExamAP.Model.Entities;
using System.Collections.Generic;

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

        // GET api/color
        [AllowAnonymous]
        [HttpGet]
        public ActionResult<IEnumerable<Color>> GetColors()
        {
            var colors = _repository.GetAllColors(); // get all colors from the repository
            return Ok(colors);
        }

    }

}