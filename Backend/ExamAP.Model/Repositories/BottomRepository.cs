/* using ExamAP.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using ExamAP.Model.Repositories;


namespace ExamAP.Model.Repositories
{
    public class BottomRepository : BaseRepository
    {
        public BottomRepository(IConfiguration configuration) : base(configuration) { }

        public List<Bottom> GetBottoms()
        {
            var bottoms = new List<Bottom>();
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM public.bottoms";

            Console.WriteLine("Connecting to DB: " + conn.ConnectionString);

            var reader = GetData(conn, cmd);

            while (reader.Read())
            {
                Console.WriteLine("Found a row!");

                var bottom = new Bottom
                {
                    BottomId = reader["bottomid"] is DBNull ? 0 : (int)reader["bottomid"],
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

                bottoms.Add(bottom);
            }

            return bottoms;
        }

        public bool InsertBottom(Bottom bottom)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();

            cmd.CommandText = @"
        INSERT INTO public.bottoms
        (userid, colorid, materialid, type, brandid, occasionid, imageurl, purchasedate, isfavorite)
        VALUES
        (@userid, @colorid, @materialid, @type, @brandid, @occasionid, @imageurl, @purchasedate, @isfavorite)
    ";

            cmd.Parameters.AddWithValue("@userid", NpgsqlDbType.Integer, bottom.UserId);
            cmd.Parameters.AddWithValue("@colorid", NpgsqlDbType.Integer, bottom.ColorId);
            cmd.Parameters.AddWithValue("@materialid", NpgsqlDbType.Integer, bottom.MaterialId);
            cmd.Parameters.AddWithValue("@type", NpgsqlDbType.Text, bottom.Type);
            cmd.Parameters.AddWithValue("@brandid", NpgsqlDbType.Integer, bottom.BrandId);
            cmd.Parameters.AddWithValue("@occasionid", NpgsqlDbType.Integer, bottom.OccasionId);
            cmd.Parameters.AddWithValue("@imageurl", NpgsqlDbType.Text, (object?)bottom.ImageUrl ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@purchasedate", NpgsqlDbType.Date, (object?)bottom.PurchaseDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@isfavorite", NpgsqlDbType.Boolean, (object?)bottom.IsFavorite ?? DBNull.Value);

            return InsertData(conn, cmd);
        }

        public bool UpdateBottom(Bottom bottom)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();

            cmd.CommandText = @"
        UPDATE public.bottoms SET
            userid = @userid,
            colorid = @colorid,
            materialid = @materialid,
            type = @type,
            brandid = @brandid,
            occasionid = @occasionid,
            imageurl = @imageurl,
            purchasedate = @purchasedate,
            isfavorite = @isfavorite
        WHERE bottomid = @bottomid
    ";

            cmd.Parameters.AddWithValue("@bottomid", NpgsqlDbType.Integer, bottom.BottomId);
            cmd.Parameters.AddWithValue("@userid", NpgsqlDbType.Integer, bottom.UserId);
            cmd.Parameters.AddWithValue("@colorid", NpgsqlDbType.Integer, bottom.ColorId);
            cmd.Parameters.AddWithValue("@materialid", NpgsqlDbType.Integer, bottom.MaterialId);
            cmd.Parameters.AddWithValue("@type", NpgsqlDbType.Text, bottom.Type);
            cmd.Parameters.AddWithValue("@brandid", NpgsqlDbType.Integer, bottom.BrandId);
            cmd.Parameters.AddWithValue("@occasionid", NpgsqlDbType.Integer, bottom.OccasionId);
            cmd.Parameters.AddWithValue("@imageurl", NpgsqlDbType.Text, (object?)bottom.ImageUrl ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@purchasedate", NpgsqlDbType.Date, (object?)bottom.PurchaseDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@isfavorite", NpgsqlDbType.Boolean, (object?)bottom.IsFavorite ?? DBNull.Value);

            return UpdateData(conn, cmd);
        }

        public bool DeleteBottom(int bottomId)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();

            cmd.CommandText = "DELETE FROM public.bottoms WHERE bottomid = @bottomid";
            cmd.Parameters.AddWithValue("@bottomid", NpgsqlDbType.Integer, bottomId);

            return DeleteData(conn, cmd);
        }
    }
} */