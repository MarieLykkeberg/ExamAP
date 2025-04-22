using ExamAP.Model.Entities;  // This imports the Occasion entity
using Microsoft.Extensions.Configuration;  // This imports IConfiguration for accessing configuration
using Npgsql;  // This is for database connectivity using Npgsql
using System.Collections.Generic;  // This is for using List<T>

namespace ExamAP.Model.Repositories
{
    public class OccasionRepository : BaseRepository
    {
        public OccasionRepository(IConfiguration configuration) : base(configuration) { }

        public List<Occasion> GetAllOccasions()
        {
            var Occasions = new List<Occasion>();  // Declare the list with uppercase 'O'
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM public.occasions";  // Query to fetch all categories

            
            var reader = GetData(conn, cmd);

            while (reader.Read())
            {
                Occasions.Add(new Occasion  // Use 'Occasions' consistently with uppercase 'O'
                {
                    OccasionId = (int)reader["occasionid"],
                    OccasionName = reader["occasionname"].ToString()
                });
            }

            return Occasions;  // Return the list with uppercase 'O'
        }
    }
}
