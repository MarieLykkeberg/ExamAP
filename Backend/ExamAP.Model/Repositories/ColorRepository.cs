using ExamAP.Model.Entities;  
using Microsoft.Extensions.Configuration;  
using Npgsql;  
using System.Collections.Generic;  


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
            cmd.CommandText = "SELECT * FROM public.colors";  

           
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

    }
}
