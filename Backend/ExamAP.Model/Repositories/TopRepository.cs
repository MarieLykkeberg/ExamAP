using ExamAP.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using ExamAP.Model.Repositories;


namespace ExamAP.Model.Repositories
{
    public class TopRepository : BaseRepository
    {
        public TopRepository(IConfiguration configuration) : base(configuration) { }

public List<Top> GetTops()
{
    var tops = new List<Top>();
    using var conn = new NpgsqlConnection(ConnectionString);
    var cmd = conn.CreateCommand();
    cmd.CommandText = "SELECT * FROM public.tops"; // ← updated this too

    // 👇 Add this line to confirm DB connection info
    Console.WriteLine("Connecting to DB: " + conn.ConnectionString);

    var reader = GetData(conn, cmd); // opens connection + runs query

    while (reader.Read())
    {
        Console.WriteLine("Found a row!");

        var top = new Top
        {
            TopId = reader["topid"] is DBNull ? 0 : (int)reader["topid"],
            UserId = reader["userid"] is DBNull ? 0 : (int)reader["userid"],
            ColorId = reader["colorid"] is DBNull ? 0 : (int)reader["colorid"],
            MaterialId = reader["materialid"] is DBNull ? 0 : (int)reader["materialid"],
            Type = reader["type"]?.ToString(),
            BrandId = reader["brandid"] is DBNull ? 0 : (int)reader["brandid"],
            OccasionId = reader["occasionid"] is DBNull ? 0 : (int)reader["occasionid"],
            ImageUrl = reader["imageurl"]?.ToString(),
            LastWorn = reader["lastworn"] is DBNull ? null : (DateTime?)reader["lastworn"],
            IsFavorite = reader["isfavorite"] is DBNull ? null : (bool?)reader["isfavorite"]
        };

        tops.Add(top);
    }

    return tops;
    }
}
}