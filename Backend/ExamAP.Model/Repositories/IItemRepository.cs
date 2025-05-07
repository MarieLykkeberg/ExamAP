using ExamAP.Model.Entities;

namespace ExamAP.Model.Repositories
{
    public interface IItemRepository
    {
        List<Item> GetItemsByUserId(int userId);
        Item? GetItemById(int itemId);
        bool InsertItem(Item item);
        bool UpdateItem(Item item);
        bool DeleteItem(int itemId);
    }
} 