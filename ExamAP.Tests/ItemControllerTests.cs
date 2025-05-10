using Microsoft.AspNetCore.Mvc;
using ExamAP.API.Controllers;
using ExamAP.Model.Repositories;
using ExamAP.Model.Entities;
using Moq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace ExamAP.Tests
{
    [TestClass]
    public class ItemControllerTests
    {
        private Mock<IItemRepository> _mockRepository;
        private ItemController _controller;
        private const int TestUserId = 1;

        [TestInitialize]
        public void Setup()
        {
            _mockRepository = new Mock<IItemRepository>();
            _controller = new ItemController(_mockRepository.Object);
            
            // Setup user claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, TestUserId.ToString())
            };
            var identity = new ClaimsIdentity(claims);
            var principal = new ClaimsPrincipal(identity);
            
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = principal }
            };
        }

        [TestMethod]
        public void GetItems_User() // Should return items for the current user
        {
            // Arrange
            var expectedItems = new List<Item>
            {
                new Item { ItemId = 1, UserId = TestUserId, BrandName = "Test Brand 1" },
                new Item { ItemId = 2, UserId = TestUserId, BrandName = "Test Brand 2" }
            };
            _mockRepository.Setup(r => r.GetItemsByUserId(TestUserId))
                          .Returns(expectedItems);

            // Act
            var result = _controller.GetItems();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var items = okResult.Value as IEnumerable<Item>;
            Assert.IsNotNull(items);
            Assert.AreEqual(2, new List<Item>(items).Count);
        }

        [TestMethod]
        public void GetItemById_Valid() // Should return the correct item for a given ID
        {
            // Arrange
            var expectedItem = new Item { ItemId = 1, UserId = TestUserId, BrandName = "Test Brand" };
            _mockRepository.Setup(r => r.GetItemById(1))
                          .Returns(expectedItem);

            // Act
            var result = _controller.GetItemById(1);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var item = okResult.Value as Item;
            Assert.IsNotNull(item);
            Assert.AreEqual(expectedItem.ItemId, item.ItemId);
        }

        [TestMethod]
        public void AddItem_Valid() // Should create a new item
        {
            // Arrange
            var newItem = new Item { BrandName = "New Brand" };
            _mockRepository.Setup(r => r.InsertItem(It.IsAny<Item>()))
                          .Returns(true);

            // Act
            var result = _controller.AddItem(newItem);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkResult));
            _mockRepository.Verify(r => r.InsertItem(It.Is<Item>(i => 
                i.UserId == TestUserId && i.BrandName == "New Brand")), Times.Once);
        }

        [TestMethod]
        public void UpdateItem_Valid() // Should update an existing item
        {
            // Arrange
            var existingItem = new Item { ItemId = 1, UserId = TestUserId, BrandName = "Original" };
            var updatedItem = new Item { ItemId = 1, BrandName = "Updated" };
            
            _mockRepository.Setup(r => r.GetItemById(1))
                          .Returns(existingItem);
            _mockRepository.Setup(r => r.UpdateItem(It.IsAny<Item>()))
                          .Returns(true);

            // Act
            var result = _controller.UpdateItem(1, updatedItem);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
            _mockRepository.Verify(r => r.UpdateItem(It.Is<Item>(i => 
                i.ItemId == 1 && i.UserId == TestUserId)), Times.Once);
        }

        [TestMethod]
        public void DeleteItem_Valid() // Should delete an item
        {
            // Arrange
            var existingItem = new Item { ItemId = 1, UserId = TestUserId };
            _mockRepository.Setup(r => r.GetItemById(1))
                          .Returns(existingItem);
            _mockRepository.Setup(r => r.DeleteItem(1))
                          .Returns(true);

            // Act
            var result = _controller.DeleteItem(1);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
            _mockRepository.Verify(r => r.DeleteItem(1), Times.Once);
        }
    }
} 