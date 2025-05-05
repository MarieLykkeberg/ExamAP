using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ExamAP.Model.Repositories;
using ExamAP.Model.Entities;
using System.Collections.Generic;
using ExamAP.API.Dtos;

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
            var colors = _repository.GetAllColors();
            return Ok(colors);
        }

        // POST api/color
        [Authorize]
        [HttpPost]
        public IActionResult AddColor([FromBody] NameDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            var success = _repository.InsertColor(dto.Name);
            if (!success)
                return StatusCode(500, "Failed to insert color.");

            return Ok();
        }
    }

}