/* using System.Text.Json.Serialization;

public class User
{
    [JsonPropertyName("email")]
    public string Email { get; set; }

    [JsonPropertyName("password")]
    public string Password { get; set; }
} */

namespace ExamAP.Model.Entities
{
    public class User
    {
        public int UserId { get; set; }          // ✅ This line must exist
        public string Email { get; set; }
        public string Password { get; set; }     // maps to passwordhash in DB
    }
}
