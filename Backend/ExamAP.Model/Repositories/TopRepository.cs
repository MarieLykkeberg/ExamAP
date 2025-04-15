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
            cmd.CommandText = "SELECT * FROM public.tops";

            Console.WriteLine("Connecting to DB: " + conn.ConnectionString);

            var reader = GetData(conn, cmd);

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
                    PurchaseDate = reader["purchasedate"] is DBNull ? null : (DateTime?)reader["purchasedate"],
                    IsFavorite = reader["isfavorite"] is DBNull ? null : (bool?)reader["isfavorite"]
                };

                tops.Add(top);
            }

            return tops;
        }

        public bool InsertTop(Top top)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();

            cmd.CommandText = @"
        INSERT INTO public.tops
        (userid, colorid, materialid, type, brandid, occasionid, imageurl, purchasedate, isfavorite)
        VALUES
        (@userid, @colorid, @materialid, @type, @brandid, @occasionid, @imageurl, @purchasedate, @isfavorite)
    ";

            cmd.Parameters.AddWithValue("@userid", NpgsqlDbType.Integer, top.UserId);
            cmd.Parameters.AddWithValue("@colorid", NpgsqlDbType.Integer, top.ColorId);
            cmd.Parameters.AddWithValue("@materialid", NpgsqlDbType.Integer, top.MaterialId);
            cmd.Parameters.AddWithValue("@type", NpgsqlDbType.Text, top.Type);
            cmd.Parameters.AddWithValue("@brandid", NpgsqlDbType.Integer, top.BrandId);
            cmd.Parameters.AddWithValue("@occasionid", NpgsqlDbType.Integer, top.OccasionId);
            cmd.Parameters.AddWithValue("@imageurl", NpgsqlDbType.Text, (object?)top.ImageUrl ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@purchasedate", NpgsqlDbType.Date, (object?)top.PurchaseDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@isfavorite", NpgsqlDbType.Boolean, (object?)top.IsFavorite ?? DBNull.Value);

            return InsertData(conn, cmd);
        }

        public bool UpdateTop(Top top)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();

            cmd.CommandText = @"
        UPDATE public.tops SET
            userid = @userid,
            colorid = @colorid,
            materialid = @materialid,
            type = @type,
            brandid = @brandid,
            occasionid = @occasionid,
            imageurl = @imageurl,
            purchasedate = @purchasedate,
            isfavorite = @isfavorite
        WHERE topid = @topid
    ";

            cmd.Parameters.AddWithValue("@topid", NpgsqlDbType.Integer, top.TopId);
            cmd.Parameters.AddWithValue("@userid", NpgsqlDbType.Integer, top.UserId);
            cmd.Parameters.AddWithValue("@colorid", NpgsqlDbType.Integer, top.ColorId);
            cmd.Parameters.AddWithValue("@materialid", NpgsqlDbType.Integer, top.MaterialId);
            cmd.Parameters.AddWithValue("@type", NpgsqlDbType.Text, top.Type);
            cmd.Parameters.AddWithValue("@brandid", NpgsqlDbType.Integer, top.BrandId);
            cmd.Parameters.AddWithValue("@occasionid", NpgsqlDbType.Integer, top.OccasionId);
            cmd.Parameters.AddWithValue("@imageurl", NpgsqlDbType.Text, (object?)top.ImageUrl ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@purchasedate", NpgsqlDbType.Date, (object?)top.PurchaseDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@isfavorite", NpgsqlDbType.Boolean, (object?)top.IsFavorite ?? DBNull.Value);

            return UpdateData(conn, cmd);
        }

        public bool DeleteTop(int topId)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();

            cmd.CommandText = "DELETE FROM public.tops WHERE topid = @topid";
            cmd.Parameters.AddWithValue("@topid", NpgsqlDbType.Integer, topId);

            return DeleteData(conn, cmd);
        }
    }
}