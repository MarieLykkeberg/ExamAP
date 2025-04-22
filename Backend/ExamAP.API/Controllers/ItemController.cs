using Microsoft.AspNetCore.Mvc;
using ExamAP.Model.Repositories;
using ExamAP.Model.Entities;

namespace ExamAP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly ItemRepository _repository;

        public ItemController(ItemRepository repository)
        {
            _repository = repository;
        }

        // Change the method name to GetItems
        [HttpGet]
        public ActionResult<IEnumerable<Item>> GetItems()  // <-- Fix method name here
        {
            var items = _repository.GetItems();  // <-- Call GetItems, not GetItem
            return Ok(items);  // <-- Return the correct variable: items, not item
        }

        [HttpPost]
        public IActionResult AddItem([FromBody] Item item)
        {
            if (item == null)
            {
                return BadRequest("Item data is missing.");
            }

            bool success = _repository.InsertItem(item);
            if (success)
            {
                return Ok(new { message = "Item added successfully" });
            }

            return StatusCode(500, "Something went wrong.");
        }


        [HttpPut]
        public IActionResult UpdateItem([FromBody] Item item)
        {
            if (item == null || item.ItemId == 0)
            {
                return BadRequest("Invalid item data.");
            }

            bool success = _repository.UpdateItem(item);
            if (success)
            {
                return Ok("Item updated successfully.");
            }

            return StatusCode(500, "Something went wrong while updating the item.");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteItem(int id)
        {
            bool success = _repository.DeleteItem(id);

            if (success)
            {
                return NoContent(); // 204 success with no body
            }

            return NotFound($"Item with id {id} not found.");
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

            Console.WriteLine("Upload path: " + filePath);

            // Return public URL (adjust based on your local setup)
            var imageUrl = $"http://localhost:5196/Uploads/{uniqueFileName}";
            return Ok(new { imageUrl });
        }
    }
}
