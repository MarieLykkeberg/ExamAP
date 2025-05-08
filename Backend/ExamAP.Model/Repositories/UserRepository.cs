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
                cmd.CommandText = "INSERT INTO users (name, email, password) VALUES (@Name, @Email, @Password)";
                cmd.Parameters.AddWithValue("@Name", user.Name);
                cmd.Parameters.AddWithValue("@Email", user.Email);
                cmd.Parameters.AddWithValue("@Password", user.Password);
                return InsertData(conn, cmd);
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
            cmd.CommandText = "SELECT * FROM users WHERE email = @Email AND password = @Password";
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
                    Password = reader["password"].ToString()
                };
            }

            return null;
        }

        public User GetUserById(int id)
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            var cmd  = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT userid, name, email, password 
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
                Password = reader["password"] as string
            };
        }

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
                           password = @Password
                     WHERE userid = @UserId
                ";
                cmd.Parameters.AddWithValue("@Name", user.Name);
                cmd.Parameters.AddWithValue("@Email", user.Email);
                cmd.Parameters.AddWithValue("@Password", user.Password);
                cmd.Parameters.AddWithValue("@UserId", user.UserId);
                return UpdateData(conn, cmd);
            }
            catch
            {
                return false;
            }
        }

        public bool DeleteUser(int id)
        {
            try
            {
                using var conn = new NpgsqlConnection(ConnectionString);
                var cmd = conn.CreateCommand();
                cmd.CommandText = "DELETE FROM users WHERE userid = @UserId";
                cmd.Parameters.AddWithValue("@UserId", id);
                return DeleteData(conn, cmd);
            }
            catch
            {
                return false;
            }
        }
    }
}
