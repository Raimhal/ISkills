using BLL.DtoModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IDatabaseService
    {
        public Task<string> BackupDatabase(string databaseString, string postgresPath);
        public void RestoreDatabase(string databaseString, string postgresPath, string backupUrl);
        public Task<PaginationList<CloudinarySearchResourceDto>> GetBackups(int skip, int take);

    }
}
