using System;
using System.Text;

namespace ExamAP.API.Middleware
{
    public class AuthenticationHelper
    {
        // create a Basic Auth header from username and password

        public static string Encrypt(string username, string password)
        {
            // combine username & password into one string
            string credentials = $"{username}:{password}";
            
            // convert to Base64 (a way to encode text)
            byte[] bytes = Encoding.UTF8.GetBytes(credentials);
            string base64 = Convert.ToBase64String(bytes);
            
            // add basic in front of base64 encoding
            return $"Basic {base64}";
        }

     
        // extract username and password from a Basic Auth header
       
        public static void Decrypt(string authHeader, out string username, out string password)
        {
            // check if header exits and has the right format
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Basic "))
            {
                throw new FormatException("Header must start with 'Basic '");
            }

            try
            {
                // then remove "basic" and decode
                string base64 = authHeader.Substring(6);
                byte[] bytes = Convert.FromBase64String(base64);
                string credentials = Encoding.UTF8.GetString(bytes);

                // split the username and password up
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