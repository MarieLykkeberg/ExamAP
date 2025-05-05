namespace ExamAP.API.Dtos
{
    public class ItemDto
    {
        public int?    CategoryId   { get; set; }
        public int?    ColorId      { get; set; }
        public int?    MaterialId   { get; set; }
        public string? BrandName    { get; set; }
        public int?    OccasionId   { get; set; }
        public bool    IsFavorite   { get; set; }
        public string  PurchaseDate { get; set; }
        public string  ImageUrl     { get; set; }
    }
}