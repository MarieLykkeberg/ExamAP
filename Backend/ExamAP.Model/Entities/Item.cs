namespace ExamAP.Model.Entities
{
    public class Item
    {
        public int ItemId { get; set; }
        public int UserId { get; set; }
        public int ColorId { get; set; }
        public int MaterialId { get; set; }
        public int CategoryId { get; set; } // the type (e.g top, bottom, etc.)
        public int BrandId { get; set; }
        public int OccasionId { get; set; }
        public string ImageUrl { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public bool? IsFavorite { get; set; }
    }
}