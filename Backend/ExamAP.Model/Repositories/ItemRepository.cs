using ExamAP.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;

namespace ExamAP.Model.Repositories
{
    public class ItemRepository : BaseRepository
    {
        public ItemRepository(IConfiguration configuration) : base(configuration) { }

        public List<Item> GetItemsByUserId(int userId)
        {
            var items = new List<Item>();
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM public.items WHERE userid = @userId";
            cmd.Parameters.AddWithValue("@userId", NpgsqlDbType.Integer, userId);

            var reader = GetData(conn, cmd);
            while (reader.Read())
            {
                items.Add(new Item
                {
                    ItemId       = reader["itemid"]       as int?    ?? 0,
                    UserId       = reader["userid"]       as int?    ?? 0,
                    ColorId      = reader["colorid"]      as int?    ?? 0,
                    MaterialId   = reader["materialid"]   as int?    ?? 0,
                    CategoryId   = reader["categoryid"]   as int?    ?? 0,
                    BrandName    = reader["brandname"] as string ?? string.Empty,                    OccasionId   = reader["occasionid"]   as int?    ?? 0,
                    ImageUrl     = reader["imageurl"]     as string,
                    PurchaseDate = reader["purchasedate"] as DateTime?,
                    IsFavorite   = reader["isfavorite"]   as bool?   ?? false
                });
            }

            return items;
        }

        public Item? GetItemById(int itemId)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT itemid, userid, colorid, materialid, categoryid,
                       brandname, occasionid, imageurl, purchasedate, isfavorite
                  FROM public.items
                 WHERE itemid = @id";
            cmd.Parameters.AddWithValue("@id", NpgsqlDbType.Integer, itemId);

            using var reader = GetData(conn, cmd);
            if (!reader.Read()) return null;

            return new Item
            {
                ItemId       = reader.GetInt32(reader.GetOrdinal("itemid")),
                UserId       = reader.GetInt32(reader.GetOrdinal("userid")),
                ColorId      = reader.GetInt32(reader.GetOrdinal("colorid")),
                MaterialId   = reader.GetInt32(reader.GetOrdinal("materialid")),
                CategoryId   = reader.GetInt32(reader.GetOrdinal("categoryid")),
                BrandName    = reader["brandname"]    as string ?? string.Empty,
                OccasionId   = reader.GetInt32(reader.GetOrdinal("occasionid")),
                ImageUrl     = reader["imageurl"]     as string,
                PurchaseDate = reader["purchasedate"] as DateTime?,
                IsFavorite   = reader["isfavorite"]   as bool?
            };
        }

        public bool InsertItem(Item item)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO public.items
                   (userid, colorid, materialid, categoryid,
                    brandname, occasionid, imageurl, purchasedate, isfavorite)
                VALUES
                   (@userid, @colorid, @materialid, @categoryid,
                    @brandname, @occasionid, @imageurl, @purchasedate, @isfavorite)";
            cmd.Parameters.AddWithValue("@userid",     NpgsqlDbType.Integer, item.UserId);
            cmd.Parameters.AddWithValue("@colorid",    NpgsqlDbType.Integer, item.ColorId);
            cmd.Parameters.AddWithValue("@materialid", NpgsqlDbType.Integer, item.MaterialId);
            cmd.Parameters.AddWithValue("@categoryid", NpgsqlDbType.Integer, item.CategoryId);
            cmd.Parameters.AddWithValue("@brandname",  NpgsqlDbType.Text,    item.BrandName ?? string.Empty);
            cmd.Parameters.AddWithValue("@occasionid", NpgsqlDbType.Integer, item.OccasionId);
            cmd.Parameters.AddWithValue("@imageurl",   NpgsqlDbType.Text,    (object?)item.ImageUrl   ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@purchasedate",NpgsqlDbType.Date,    (object?)item.PurchaseDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@isfavorite", NpgsqlDbType.Boolean, (object?)item.IsFavorite   ?? DBNull.Value);

            return InsertData(conn, cmd);
        }

        public bool UpdateItem(Item item)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                UPDATE public.items SET
                  userid       = @userid,
                  colorid      = @colorid,
                  materialid   = @materialid,
                  categoryid   = @categoryid,
                  brandname    = @brandname,
                  occasionid   = @occasionid,
                  imageurl     = @imageurl,
                  purchasedate = @purchasedate,
                  isfavorite   = @isfavorite
                WHERE itemid = @itemid";

            cmd.Parameters.AddWithValue("@itemid",      NpgsqlDbType.Integer, item.ItemId);
            cmd.Parameters.AddWithValue("@userid",      NpgsqlDbType.Integer, item.UserId);
            cmd.Parameters.AddWithValue("@colorid",     NpgsqlDbType.Integer, item.ColorId);
            cmd.Parameters.AddWithValue("@materialid",  NpgsqlDbType.Integer, item.MaterialId);
            cmd.Parameters.AddWithValue("@categoryid",  NpgsqlDbType.Integer, item.CategoryId);
            cmd.Parameters.AddWithValue("@brandname",   NpgsqlDbType.Text,    item.BrandName ?? string.Empty);
            cmd.Parameters.AddWithValue("@occasionid",  NpgsqlDbType.Integer, item.OccasionId);
            cmd.Parameters.AddWithValue("@imageurl",    NpgsqlDbType.Text,    (object?)item.ImageUrl   ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@purchasedate",NpgsqlDbType.Date,    (object?)item.PurchaseDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@isfavorite",  NpgsqlDbType.Boolean, (object?)item.IsFavorite   ?? DBNull.Value);

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