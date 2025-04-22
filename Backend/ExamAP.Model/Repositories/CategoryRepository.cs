using ExamAP.Model.Entities;  // This imports the Category entity
using Microsoft.Extensions.Configuration;  // This imports IConfiguration for accessing configuration
using Npgsql;  // This is for database connectivity using Npgsql
using System.Collections.Generic;  // This is for using List<T>


namespace ExamAP.Model.Repositories
{
    public class CategoryRepository : BaseRepository
    {
        public CategoryRepository(IConfiguration configuration) : base(configuration) { }

        public List<Category> GetAllCategories()
        {
            var categories = new List<Category>();
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM public.categories";  // Query to fetch all categories

         
            var reader = GetData(conn, cmd);

            while (reader.Read())
            {
                categories.Add(new Category
                {
                    CategoryId = (int)reader["categoryid"],
                    CategoryName = reader["categoryname"].ToString()
                });
            }

            return categories;
        }
    }
}
