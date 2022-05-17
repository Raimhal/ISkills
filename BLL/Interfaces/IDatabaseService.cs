using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IDatabaseService
    {
        public void BackupDatabase(string databaseString, string postgresPath, string outputDirectoryPath);
        public void RestoreDatabase(string databaseString, string postgresPath, string inputFilePath);

    }
}
