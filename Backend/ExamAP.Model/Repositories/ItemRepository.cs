using ExamAP.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;

namespace ExamAP.Model.Repositories
{
    public class ItemRepository : BaseRepository
    {
        public ItemRepository(IConfiguration configuration) : base(configuration) { }

        public List<Item> GetItems()
        {
            var items = new List<Item>();
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM public.items";

            Console.WriteLine("Connecting to DB: " + conn.ConnectionString);

            var reader = GetData(conn, cmd);

            while (reader.Read())
            {
                Console.WriteLine("Found a row!");

                var item = new Item
                {
                    ItemId = reader["itemid"] is DBNull ? 0 : (int)reader["itemid"],
                    UserId = reader["userid"] is DBNull ? 0 : (int)reader["userid"],
                    ColorId = reader["colorid"] is DBNull ? 0 : (int)reader["colorid"],
                    MaterialId = reader["materialid"] is DBNull ? 0 : (int)reader["materialid"],
                    CategoryId = reader["categoryid"] is DBNull ? 0 : (int)reader["categoryid"],
                    BrandId = reader["brandid"] is DBNull ? 0 : (int)reader["brandid"],
                    OccasionId = reader["occasionid"] is DBNull ? 0 : (int)reader["occasionid"],
                    ImageUrl = reader["imageurl"]?.ToString(),
                    PurchaseDate = reader["purchasedate"] is DBNull ? null : (DateTime?)reader["purchasedate"],
                    IsFavorite = reader["isfavorite"] is DBNull ? null : (bool?)reader["isfavorite"]
                };

                items.Add(item);
            }

            return items;
        }

        public bool InsertItem(Item item)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();

            cmd.CommandText = @"
                INSERT INTO public.items
                (userid, colorid, materialid, categoryid, brandid, occasionid, imageurl, purchasedate, isfavorite)
                VALUES
                (@userid, @colorid, @materialid, @categoryid, @brandid, @occasionid, @imageurl, @purchasedate, @isfavorite)
            ";

            cmd.Parameters.AddWithValue("@userid", NpgsqlDbType.Integer, item.UserId);
            cmd.Parameters.AddWithValue("@colorid", NpgsqlDbType.Integer, item.ColorId);
            cmd.Parameters.AddWithValue("@materialid", NpgsqlDbType.Integer, item.MaterialId);
            cmd.Parameters.AddWithValue("@categoryid", NpgsqlDbType.Integer, item.CategoryId);
            cmd.Parameters.AddWithValue("@brandid", NpgsqlDbType.Integer, item.BrandId);
            cmd.Parameters.AddWithValue("@occasionid", NpgsqlDbType.Integer, item.OccasionId);
            cmd.Parameters.AddWithValue("@imageurl", NpgsqlDbType.Text, (object?)item.ImageUrl ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@purchasedate", NpgsqlDbType.Date, (object?)item.PurchaseDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@isfavorite", NpgsqlDbType.Boolean, (object?)item.IsFavorite ?? DBNull.Value);

            return InsertData(conn, cmd);  // This method should execute the query and insert the data
        }

        public bool UpdateItem(Item item)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();

            cmd.CommandText = @"
            UPDATE public.items SET
                userid = @userid,
                colorid = @colorid,
                materialid = @materialid,
                categoryid = @categoryid,
                brandid = @brandid,
                occasionid = @occasionid,
                imageurl = @imageurl,
                purchasedate = @purchasedate,
                isfavorite = @isfavorite
            WHERE itemid = @itemid
            ";

            cmd.Parameters.AddWithValue("@itemid", NpgsqlDbType.Integer, item.ItemId);
            cmd.Parameters.AddWithValue("@userid", NpgsqlDbType.Integer, item.UserId);
            cmd.Parameters.AddWithValue("@colorid", NpgsqlDbType.Integer, item.ColorId);
            cmd.Parameters.AddWithValue("@materialid", NpgsqlDbType.Integer, item.MaterialId);
            cmd.Parameters.AddWithValue("@categoryid", NpgsqlDbType.Integer, item.CategoryId);
            cmd.Parameters.AddWithValue("@brandid", NpgsqlDbType.Integer, item.BrandId);
            cmd.Parameters.AddWithValue("@occasionid", NpgsqlDbType.Integer, item.OccasionId);
            cmd.Parameters.AddWithValue("@imageurl", NpgsqlDbType.Text, (object?)item.ImageUrl ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@purchasedate", NpgsqlDbType.Date, (object?)item.PurchaseDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@isfavorite", NpgsqlDbType.Boolean, (object?)item.IsFavorite ?? DBNull.Value);

            return UpdateData(conn, cmd);
        }

        public bool DeleteItem(int itemId)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();

            cmd.CommandText = "DELETE FROM public.items WHERE itemid = @itemid";
            cmd.Parameters.AddWithValue("@itemid", NpgsqlDbType.Integer, itemId);

            return DeleteData(conn, cmd);
        }
    }
}