using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExamAP.Model.Repositories;
using ExamAP.Model.Entities;

namespace ExamAP.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly IItemRepository _repository;
        public ItemController(IItemRepository repository) => _repository = repository;

        [HttpGet]
        public ActionResult<IEnumerable<Item>> GetItems()
        {
            var uid = GetCurrentUserId();
            var items = _repository.GetItemsByUserId(uid); // Looks up all users items by userId in the database using the repository
            return Ok(items);
        }

        [HttpGet("{id}")]
        public ActionResult<Item> GetItemById(int id)
        {
            var uid = GetCurrentUserId();
            var it = _repository.GetItemById(id); // Looks up the item by ID in the database using the repository
            if (it == null || it.UserId != uid)
                return NotFound();
            return Ok(it);
        }

        [HttpPost]
        public IActionResult AddItem([FromBody] Item item)
        {
            item.UserId = GetCurrentUserId();
            bool ok = _repository.InsertItem(item); // Insert item into the repository
            if (!ok) return StatusCode(500);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult UpdateItem(int id, [FromBody] Item item)
        {
            if (item == null || item.ItemId != id)
                return BadRequest();

            var existing = _repository.GetItemById(id); // Looks up the item by ID in the database using the repository
            if (existing == null || existing.UserId != GetCurrentUserId())
                return NotFound();

            item.UserId = existing.UserId;
            bool updated = _repository.UpdateItem(item); // Update item in the repository
            if (!updated) return StatusCode(500);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteItem(int id)
        {
            var existing = _repository.GetItemById(id); // Looks up the item by ID in the database using the repository
            if (existing == null || existing.UserId != GetCurrentUserId())
                return NotFound();

            bool deleted = _repository.DeleteItem(id); // Delete item from the repository
            if (!deleted) return StatusCode(500);
            return NoContent();
        }

        private int GetCurrentUserId()
        {
            var c = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier); // Get the current user's id
            return int.Parse(c.Value);
        }
    }
}