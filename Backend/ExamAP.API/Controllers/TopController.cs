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
    }
}