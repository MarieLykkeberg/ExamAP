using Microsoft.VisualStudio.TestTools.UnitTesting;
using ExamAP.API.Helpers;

namespace ExamAP.Tests
{
    [TestClass]
    public class AuthenticationHelperTests
    {
        [TestMethod]
        public void Encrypt_ShouldCreateValidBasicAuthHeader()
        {
            // Arrange
            string username = "test.user";
            string password = "test123";

            // Act
            string authHeader = AuthenticationHelper.Encrypt(username, password);

            // Assert
            Assert.IsNotNull(authHeader);
            Assert.IsTrue(authHeader.StartsWith("Basic "));
            string base64Part = authHeader.Substring(6); // Remove "Basic "
            Assert.IsTrue(IsValidBase64(base64Part));
        }

        [TestMethod]
        public void Decrypt_ShouldExtractOriginalCredentials()
        {
            // Arrange
            string originalUsername = "test.user";
            string originalPassword = "test123";
            string authHeader = AuthenticationHelper.Encrypt(originalUsername, originalPassword);

            // Act
            string extractedUsername;
            string extractedPassword;
            AuthenticationHelper.Decrypt(authHeader, out extractedUsername, out extractedPassword);

            // Assert
            Assert.AreEqual(originalUsername, extractedUsername);
            Assert.AreEqual(originalPassword, extractedPassword);
        }

        [TestMethod]
        [ExpectedException(typeof(FormatException))]
        public void Decrypt_WithInvalidHeader_ShouldThrowException()
        {
            // Arrange
            string invalidHeader = "InvalidFormat";

            // Act
            AuthenticationHelper.Decrypt(invalidHeader, out string username, out string password);
        }

        // Helper method to validate Base64 string
        private bool IsValidBase64(string base64String)
        {
            try
            {
                Convert.FromBase64String(base64String);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
} 