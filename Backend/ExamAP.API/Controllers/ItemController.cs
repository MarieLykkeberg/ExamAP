using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System;
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
            var uid   = GetCurrentUserId();
            var items = _repository.GetItemsByUserId(uid);
            return Ok(items);
        }

        [HttpGet("{id}")]
        public ActionResult<Item> GetItemById(int id)
        {
            var uid  = GetCurrentUserId();
            var it   = _repository.GetItemById(id);
            if (it == null || it.UserId != uid)
               return NotFound();
            return Ok(it);
        }

        [HttpPost]
        public IActionResult AddItem([FromBody] Item item)
        {
            item.UserId    = GetCurrentUserId();
            bool ok        = _repository.InsertItem(item);
            if (!ok) return StatusCode(500);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult UpdateItem(int id, [FromBody] Item item)
        {
            if (item == null || item.ItemId != id)
                return BadRequest();

            var existing = _repository.GetItemById(id);
            if (existing == null || existing.UserId != GetCurrentUserId())
                return NotFound();

            item.UserId = existing.UserId;
            bool updated = _repository.UpdateItem(item);
            if (!updated) return StatusCode(500);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteItem(int id)
        {
            var existing = _repository.GetItemById(id);
            if (existing == null || existing.UserId != GetCurrentUserId())
                return NotFound();

            bool deleted = _repository.DeleteItem(id);
            if (!deleted) return StatusCode(500);
            return NoContent();
        }

        private int GetCurrentUserId()
        {
            var c = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            return int.Parse(c.Value);
        }
    }
}