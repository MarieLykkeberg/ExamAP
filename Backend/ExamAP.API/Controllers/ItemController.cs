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


        [HttpGet]
        public ActionResult<IEnumerable<Item>> GetItems()
        {
            int currentUserId = GetCurrentUserId(); // Implement this method below
            var items = _repository.GetItemsByUserId(currentUserId);
            return Ok(items);
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }

        [HttpPost]
        public IActionResult AddItem([FromBody] Item item)
        {
            if (item == null)
            {
                return BadRequest("Item data is missing.");
            }

            //Set the correct user ID from the authenticated user
            item.UserId = GetCurrentUserId();

            bool success = _repository.InsertItem(item);
            if (success)
            {
                return Ok(new { message = "Item added successfully" });
            }

            return StatusCode(500, "Something went wrong.");
        }


        [HttpPut("{id}")]
        public IActionResult UpdateItem(int id, [FromBody] Item item)
        {
            // Ensure the route ID matches the body ID
            if (item == null || item.ItemId != id || id == 0)
            {
                return BadRequest("Invalid item data or mismatched id.");
            }

            int currentUserId = GetCurrentUserId();
            var existingItem = _repository.GetItemById(id);

            if (existingItem == null || existingItem.UserId != currentUserId)
            {
                return NotFound($"Item with id {id} not found or not owned by user.");
            }

            item.UserId = currentUserId;
            // Call repository to perform the update
            bool success = _repository.UpdateItem(item);

            if (!success)
            {
                return NotFound($"Item with id {id} not found.");
            }

            // Standard REST response for successful PUT
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteItem(int id)
        {
            int currentUserId = GetCurrentUserId();
            var existingItem = _repository.GetItemById(id);

            if (existingItem == null || existingItem.UserId != currentUserId)
            {
                return NotFound($"Item with id {id} not found or not owned by user.");
            }

            bool success = _repository.DeleteItem(id);
            if (success)
            {
                return NoContent();
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

        [HttpGet("{id}")]
        public ActionResult<Item> GetItemById(int id)
        {
            int currentUserId = GetCurrentUserId();
            var item = _repository.GetItemById(id);
            if (item == null)
                return NotFound($"Item with id {id} not found.");
            return Ok(item);
        }
    }
}
