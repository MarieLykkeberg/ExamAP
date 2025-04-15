using System.Collections.Generic;
using ExamAP.Model.Entities;
using ExamAP.Model.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ExamAP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TopController : ControllerBase
    {
        private readonly TopRepository _repository;

        public TopController(TopRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Top>> GetTops()
        {
            var tops = _repository.GetTops();
            return Ok(tops);
        }


        [HttpPost]
        public IActionResult AddTop([FromBody] Top top)
        {
            if (top == null)
            {
                return BadRequest("Top data is missing.");
            }

            bool success = _repository.InsertTop(top);
            if (success)
            {
                return Ok("Top added successfully.");
            }

            return StatusCode(500, "Something went wrong.");
        }

        [HttpPut]
        public IActionResult UpdateTop([FromBody] Top top)
        {
            if (top == null || top.TopId == 0)
            {
                return BadRequest("Invalid top data.");
            }

            bool success = _repository.UpdateTop(top);
            if (success)
            {
                return Ok("Top updated successfully.");
            }

            return StatusCode(500, "Something went wrong while updating the top.");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTop(int id)
        {
            bool success = _repository.DeleteTop(id);

            if (success)
            {
                return NoContent(); // 204 success with no body
            }

            return NotFound($"Top with id {id} not found.");
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
}