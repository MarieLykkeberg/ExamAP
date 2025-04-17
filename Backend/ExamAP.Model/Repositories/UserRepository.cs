using ExamAP.Model.Entities;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace ExamAP.Model.Repositories
{
    public class UserRepository : BaseRepository
    {
        public UserRepository(IConfiguration configuration) : base(configuration) {}

        public bool InsertUser(User user)
        {
            try
            {
                using var conn = new NpgsqlConnection(ConnectionString);

                var cmd = conn.CreateCommand();
                cmd.CommandText = "INSERT INTO users (email, passwordhash) VALUES (@Email, @Password)";
                cmd.Parameters.AddWithValue("@Email", user.Email);
                cmd.Parameters.AddWithValue("@Password", user.Password);

                Console.WriteLine("Attempting to insert user...");
                bool success = InsertData(conn, cmd);
                Console.WriteLine("Insert success: " + success);
                return success;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Insert failed: " + ex.Message);
                return false;
            }
        }

        public User GetUserByCredentials(string email, string password)
        {
            Console.WriteLine($"Searching for user with email: {email} and password: {password}");

            using var conn = new NpgsqlConnection(ConnectionString);

            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM users WHERE email = @Email AND passwordhash = @Password";
            cmd.Parameters.AddWithValue("@Email", email);
            cmd.Parameters.AddWithValue("@Password", password);

            var reader = GetData(conn, cmd);

            if (reader.Read())
            {
                Console.WriteLine("Match found in database.");
                return new User
                {
                    UserId = (int)reader["userid"],
                    Email = reader["email"].ToString(),
                    Password = reader["passwordhash"].ToString()
                };
            }

            Console.WriteLine("No match found.");
            return null;
        }

    }
}