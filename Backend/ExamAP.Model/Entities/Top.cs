namespace ExamAP.Model.Entities
{
    public class Top
    {
        public int TopId { get; set; }
        public int UserId { get; set; }
        public int ColorId { get; set; }
        public int MaterialId { get; set; }
        public string Type { get; set; }
        public int BrandId { get; set; }
        public int OccasionId { get; set; }
        public string ImageUrl { get; set; }
        public DateTime? LastWorn { get; set; }
        public bool? IsFavorite { get; set; }
    }
}