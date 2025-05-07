using System;
using System.Text;

namespace ExamAP.API.Helpers
{
    public class AuthenticationHelper
    {
        public static string Encrypt(string username, string password)
        {
            // 1. Concatenate credentials with a ':'
            string credentials = $"{username}:{password}";
            // 2. Retrieve bytes from text
            byte[] bytes = Encoding.UTF8.GetBytes(credentials);
            // 3. Base64 encode credentials
            string encryptedCredentials = Convert.ToBase64String(bytes);
            // 4. Prefix credentials with 'Basic' and return
            return $"Basic {encryptedCredentials}";
        }

        public static void Decrypt(string encryptedHeader, out string username, out string password)
        {
            if (string.IsNullOrEmpty(encryptedHeader))
                throw new FormatException("Authorization header cannot be null or empty");

            var parts = encryptedHeader.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length != 2 || parts[0] != "Basic")
                throw new FormatException("Invalid authorization header format. Expected 'Basic <credentials>'");

            try
            {
                var decodedBytes = Convert.FromBase64String(parts[1]);
                var decodedString = Encoding.UTF8.GetString(decodedBytes);
                var credentials = decodedString.Split(new[] { ':' }, StringSplitOptions.RemoveEmptyEntries);
                
                if (credentials.Length != 2)
                    throw new FormatException("Invalid credentials format. Expected 'username:password'");

                username = credentials[0];
                password = credentials[1];
            }
            catch (FormatException)
            {
                throw new FormatException("Invalid Base64 encoding in credentials");
            }
        }
    }
}