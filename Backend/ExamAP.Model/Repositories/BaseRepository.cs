using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace ExamAP.Model.Repositories
{
    public class BaseRepository
    {
        protected string ConnectionString { get; }

        public BaseRepository(IConfiguration configuration)
        {
            ConnectionString = configuration.GetConnectionString("ExamAP");
        }

        protected NpgsqlDataReader GetData(NpgsqlConnection conn, NpgsqlCommand cmd)
        {
            // Open only if not already open
            if (conn.State != ConnectionState.Open)
                conn.Open();
            return cmd.ExecuteReader();
        }

        protected bool InsertData(NpgsqlConnection conn, NpgsqlCommand cmd)
        {
            if (conn.State != ConnectionState.Open)
                conn.Open();
            cmd.ExecuteNonQuery();
            return true;
        }

        protected bool UpdateData(NpgsqlConnection conn, NpgsqlCommand cmd)
        {
            if (conn.State != ConnectionState.Open)
                conn.Open();
            cmd.ExecuteNonQuery();
            return true;
        }

        protected bool DeleteData(NpgsqlConnection conn, NpgsqlCommand cmd)
        {
            if (conn.State != ConnectionState.Open)
                conn.Open();
            cmd.ExecuteNonQuery();
            return true;
        }
    }
}
