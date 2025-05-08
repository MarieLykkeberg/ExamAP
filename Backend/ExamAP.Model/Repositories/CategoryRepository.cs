using ExamAP.Model.Entities;  
using Microsoft.Extensions.Configuration; 
using Npgsql;  
using System.Collections.Generic;  


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
            cmd.CommandText = "SELECT * FROM public.categories";  

         
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
