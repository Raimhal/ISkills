using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IDatabaseService
    {
        public void BackupDatabase(string postgresqlPath, string outputDirectoryPath, string databaseName, string username, string password, string host, string port);
        public void RestoreDatabase(string postgresqlPath, string inputFilePath, string databaseName, string username, string password, string host, string port);

    }
}
