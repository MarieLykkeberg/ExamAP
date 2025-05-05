using ExamAP.Model.Entities;  // This imports the Brand entity
using Microsoft.Extensions.Configuration;  // This imports IConfiguration for accessing configuration
using Npgsql;  // This is for database connectivity using Npgsql
using System.Collections.Generic;  // This is for using List<T>


namespace ExamAP.Model.Repositories
{
    public class BrandRepository : BaseRepository
    {
        public BrandRepository(IConfiguration configuration) : base(configuration) { }

        public List<Brand> GetAllBrands()
        {
            var brands = new List<Brand>();
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM public.brands";  // Query to fetch all brands

            
            var reader = GetData(conn, cmd);

            while (reader.Read())
            {
                brands.Add(new Brand
                {
                    BrandId = (int)reader["brandid"],
                    BrandName = reader["brandname"].ToString()
                });
            }

            return brands;
        }

        public bool InsertBrand(string name)
        {
            try
            {
                using var conn = new NpgsqlConnection(ConnectionString);
                var cmd = conn.CreateCommand();
                cmd.CommandText = @"
                    INSERT INTO brands (brandname) 
                    VALUES (@Name)
                ";
                cmd.Parameters.AddWithValue("@Name", name);
                return InsertData(conn, cmd);
            }
            catch (Exception ex)
            {
                Console.WriteLine("InsertBrand failed: " + ex.Message);
                return false;
            }
        }
    }
}
