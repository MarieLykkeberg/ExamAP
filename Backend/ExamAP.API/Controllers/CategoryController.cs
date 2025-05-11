using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ExamAP.Model.Repositories;
using ExamAP.Model.Entities;

namespace ExamAP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryRepository _repository;

        public CategoryController(CategoryRepository repository)
        {
            _repository = repository;
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult<IEnumerable<Category>> GetCategories()
        {
            var categories = _repository.GetAllCategories();  // get categories from the repository
            return Ok(categories);
        }
    }
}
