/* using System.Collections.Generic;
using ExamAP.Model.Entities;
using ExamAP.Model.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ExamAP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BottomController : ControllerBase
    {
        private readonly BottomRepository _repository;

        public BottomController(BottomRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Bottom>> GetBottoms()
        {
            var bottoms = _repository.GetBottoms();
            return Ok(bottoms);
        }


        [HttpPost]
        public IActionResult AddBottom([FromBody] Bottom bottom)
        {
            if (bottom == null)
            {
                return BadRequest("Bottom data is missing.");
            }

            bool success = _repository.InsertBottom(bottom);
            if (success)
            {
                return Ok("Bottom added successfully.");
            }

            return StatusCode(500, "Something went wrong.");
        }

        [HttpPut]
        public IActionResult UpdateBottom([FromBody] Bottom bottom)
        {
            if (bottom == null || bottom.BottomId == 0)
            {
                return BadRequest("Invalid bottom data.");
            }

            bool success = _repository.UpdateBottom(bottom);
            if (success)
            {
                return Ok("Bottom updated successfully.");
            }

            return StatusCode(500, "Something went wrong while updating the bottom.");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBottom(int id)
        {
            bool success = _repository.DeleteBottom(id);

            if (success)
            {
                return NoContent(); // 204 success with no body
            }

            return NotFound($"Bottom with id {id} not found.");
        }

        [HttpPost("upload-image")]
        public IActionResult UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Save to /uploads folder
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            // Return public URL (adjust based on your local setup)
            var imageUrl = $"http://localhost:5196/Uploads/{uniqueFileName}";
            return Ok(new { imageUrl });
        }
    }
} */