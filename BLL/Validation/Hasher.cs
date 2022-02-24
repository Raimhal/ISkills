using System;
using System.Security.Cryptography;
using System.Text;

namespace BLL.Validation
{
    public static class Hasher
    {
        public static string GetSaltedHash(string password, string salt)
        {
            var bytes = Encoding.UTF8.GetBytes(password + salt);
            var saltedHash = new SHA256Managed().ComputeHash(bytes);
            return Convert.ToBase64String(saltedHash);
        }
        public static string GenerateSalt(int size)
        {
            var rng = new RNGCryptoServiceProvider();
            var buffer = new byte[size];
            rng.GetBytes(buffer);
            return Convert.ToBase64String(buffer);
        }

        public static bool AreEqual(this string password, string salt, string saltedHash)
        {
            var newSalthedHash = GetSaltedHash(password, salt);
            return newSalthedHash.Equals(saltedHash);
        }
    }
}
