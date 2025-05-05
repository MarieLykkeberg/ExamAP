using ExamAP.Model.Entities;  // This imports the Color entity
using Microsoft.Extensions.Configuration;  // This imports IConfiguration for accessing configuration
using Npgsql;  // This is for database connectivity using Npgsql
using System.Collections.Generic;  // This is for using List<T>


namespace ExamAP.Model.Repositories
{
    public class ColorRepository : BaseRepository
    {
        public ColorRepository(IConfiguration configuration) : base(configuration) { }

        public List<Color> GetAllColors()
        {
            var colors = new List<Color>();
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM public.colors";  // Query to fetch all colors

           
            var reader = GetData(conn, cmd);

            while (reader.Read())
            {
                colors.Add(new Color
                {
                    ColorId = (int)reader["colorid"],
                    ColorName = reader["colorname"].ToString()
                });
            }

            return colors;
        }

        public bool InsertColor(string name)
        {
            try
            {
                using var conn = new NpgsqlConnection(ConnectionString);
                var cmd = conn.CreateCommand();
                cmd.CommandText = @"
                    INSERT INTO colors (colorname) 
                    VALUES (@Name)
                ";
                cmd.Parameters.AddWithValue("@Name", name);
                return InsertData(conn, cmd);
            }
            catch (Exception ex)
            {
                Console.WriteLine("InsertColor failed: " + ex.Message);
                return false;
            }
        }
    }
}
