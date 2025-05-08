using ExamAP.Model.Entities; 
using Microsoft.Extensions.Configuration;  
using Npgsql;  
using System.Collections.Generic;  

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
            cmd.CommandText = "SELECT * FROM public.materials"; 

           
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