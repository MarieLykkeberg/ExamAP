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
                cmd.CommandText = "INSERT INTO users (name, email, passwordhash) VALUES (@Name, @Email, @Password)";
                cmd.Parameters.AddWithValue("@Name", user.Name);
                cmd.Parameters.AddWithValue("@Email", user.Email);
                cmd.Parameters.AddWithValue("@Password", user.Password);

                return ExecuteNonQuery(conn, cmd);
            }
            catch
            {
                return false;
            }
        }

        public User GetUserByCredentials(string email, string password)
        {
            using var conn = new NpgsqlConnection(ConnectionString);

            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT * FROM users WHERE email = @Email AND passwordhash = @Password";
            cmd.Parameters.AddWithValue("@Email", email);
            cmd.Parameters.AddWithValue("@Password", password);

            using var reader = GetData(conn, cmd);
            if (reader.Read())
            {
                return new User
                {
                    UserId   = (int)reader["userid"],
                    Name     = reader["name"].ToString(),
                    Email    = reader["email"].ToString(),
                    Password = reader["passwordhash"].ToString()
                };
            }

            return null;
        }

        public User GetUserById(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd  = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT userid, name, email, passwordhash 
                  FROM users 
                 WHERE userid = @UserId
            ";
            cmd.Parameters.AddWithValue("@UserId", id);

            using var reader = GetData(conn, cmd);
            if (!reader.Read())
                return null;

            return new User
            {
                UserId   = (int)reader["userid"],
                Name     = reader["name"] as string,
                Email    = reader["email"] as string,
                Password = reader["passwordhash"] as string
            };
        }

        // ── Add UpdateUser ───────────────────────────────────────
        /// <summary>
        /// Updates an existing user in the database.
        /// </summary>
        public bool UpdateUser(User user)
        {
            try
            {
                using var conn = new NpgsqlConnection(ConnectionString);
                var cmd = conn.CreateCommand();
                cmd.CommandText = @"
                    UPDATE users
                       SET name = @Name,
                           email = @Email,
                           passwordhash = @Password
                     WHERE userid = @UserId
                ";
                cmd.Parameters.AddWithValue("@Name", user.Name);
                cmd.Parameters.AddWithValue("@Email", user.Email);
                cmd.Parameters.AddWithValue("@Password", user.Password);
                cmd.Parameters.AddWithValue("@UserId", user.UserId);

                return ExecuteNonQuery(conn, cmd);
            }
            catch
            {
                return false;
            }
        }

        // ── Add DeleteUser ───────────────────────────────────────
        /// <summary>
        /// Deletes the user with the specified ID.
        /// </summary>
        public bool DeleteUser(int id)
        {
            try
            {
                using var conn = new NpgsqlConnection(ConnectionString);
                var cmd = conn.CreateCommand();
                cmd.CommandText = "DELETE FROM users WHERE userid = @UserId";
                cmd.Parameters.AddWithValue("@UserId", id);

                return ExecuteNonQuery(conn, cmd);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Helper to open connection and execute a non-query command, returning true if at least one row was affected.
        /// </summary>
        private bool ExecuteNonQuery(NpgsqlConnection conn, NpgsqlCommand cmd)
        {
            conn.Open();
            int affected = cmd.ExecuteNonQuery();
            return affected > 0;
        }
    }
}
