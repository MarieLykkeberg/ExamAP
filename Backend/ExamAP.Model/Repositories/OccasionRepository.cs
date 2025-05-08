using ExamAP.Model.Entities;  
using Microsoft.Extensions.Configuration;  
using Npgsql;  
using System.Collections.Generic;  

namespace ExamAP.Model.Repositories
{
    public class OccasionRepository : BaseRepository
    {
        public OccasionRepository(IConfiguration configuration) : base(configuration) { }

        public List<Occasion> GetAllOccasions()
        {
            var Occasions = new List<Occasion>(); 
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM public.occasions";  

            
            var reader = GetData(conn, cmd);

            while (reader.Read())
            {
                Occasions.Add(new Occasion  
                {
                    OccasionId = (int)reader["occasionid"],
                    OccasionName = reader["occasionname"].ToString()
                });
            }

            return Occasions;  
        }

    }
}
