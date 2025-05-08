using Microsoft.VisualStudio.TestTools.UnitTesting;
using ExamAP.API.Middleware;

namespace ExamAP.Tests
{
    [TestClass]
    public class AuthenticationHelperTests
    {
        [TestMethod]
        public void Encrypt_Valid() // Should create a Basic Auth header
        {
            // Arrange
            string username = "test.user";
            string password = "test123";

            // Act
            string authHeader = AuthenticationHelper.Encrypt(username, password);

            // Assert
            Assert.IsTrue(authHeader.StartsWith("Basic "));
            Assert.IsTrue(authHeader.Length > 6); // More than just "Basic "
        }

        [TestMethod]
        public void Decrypt_Valid() // Should return correct login credentials
        {
            // Arrange
            string username = "test.user";
            string password = "test123";
            string authHeader = AuthenticationHelper.Encrypt(username, password);

            // Act
            string extractedUsername;
            string extractedPassword;
            AuthenticationHelper.Decrypt(authHeader, out extractedUsername, out extractedPassword);

            // Assert
            Assert.AreEqual(username, extractedUsername);
            Assert.AreEqual(password, extractedPassword);
        }

        [TestMethod]
        [ExpectedException(typeof(FormatException))]
        public void Decrypt_Invalid() // Should throw exception for invalid header
        {
            // Arrange
            string invalidHeader = "NotBasicAuth";

            // Act
            AuthenticationHelper.Decrypt(invalidHeader, out string username, out string password);
        }
    }
} 