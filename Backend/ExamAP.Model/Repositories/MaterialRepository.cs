using ExamAP.Model.Entities;  // This imports the Material entity
using Microsoft.Extensions.Configuration;  // This imports IConfiguration for accessing configuration
using Npgsql;  // This is for database connectivity using Npgsql
using System.Collections.Generic;  // This is for using List<T>

namespace ExamAP.Model.Repositories
{
    public class MaterialRepository : BaseRepository
    {
        public MaterialRepository(IConfiguration configuration) : base(configuration) { }

        public List<Material> GetAllMaterials()
        {
            var materials = new List<Material>();
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM public.materials";  // Query to fetch all categories

           
            var reader = GetData(conn, cmd);

            while (reader.Read())
            {
                materials.Add(new Material
                {
                    MaterialId = (int)reader["materialid"],
                    MaterialName = reader["materialname"].ToString()
                });
            }

            return materials;
        }
    }
}