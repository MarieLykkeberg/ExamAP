using System;
using System.Text;

namespace ExamAP.API.Middleware
{
    public class AuthenticationHelper
    {
        /// Creates a Basic Auth header from username and password

        public static string Encrypt(string username, string password)
        {
            // 1. Combine username and password with a colon
            string credentials = $"{username}:{password}";
            
            // 2. Convert to Base64 (a way to encode text)
            byte[] bytes = Encoding.UTF8.GetBytes(credentials);
            string base64 = Convert.ToBase64String(bytes);
            
            // 3. Add "Basic " prefix
            return $"Basic {base64}";
        }

     
        /// Extracts username and password from a Basic Auth header
       
        public static void Decrypt(string authHeader, out string username, out string password)
        {
            // 1. Check if header exists and has correct format
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Basic "))
            {
                throw new FormatException("Header must start with 'Basic '");
            }

            try
            {
                // 2. Remove "Basic " prefix and decode Base64
                string base64 = authHeader.Substring(6);
                byte[] bytes = Convert.FromBase64String(base64);
                string credentials = Encoding.UTF8.GetString(bytes);

                // 3. Split at colon to get username and password
                string[] parts = credentials.Split(':');
                if (parts.Length != 2)
                {
                    throw new FormatException("Credentials must be in format 'username:password'");
                }

                username = parts[0];
                password = parts[1];
            }
            catch
            {
                throw new FormatException("Invalid Basic Auth header format");
            }
        }
    }
}