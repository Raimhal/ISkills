using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Drive.v3.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Services

{
    public class GoogleDriveService : IGoogleDriveService
    {
        private static string[] Scopes = { DriveService.Scope.DriveReadonly };
        private static string ApplicationName = "ISkills";

        public GoogleDriveService()
        {
        }

        public void Main()
        {
            UserCredential credential = GetUserCredential();
            DriveService service = GetDriveService(credential);
            var listRequest = service.Files.List();
            listRequest.PageSize = 10;
            listRequest.Fields = "nextPageToken, files(id, name)";
            var files = listRequest.Execute().Files;
            Console.WriteLine("Files");
            foreach (var file in files)
                Console.WriteLine($"File title: {file.Name}, file id: {file.Id}");
            Console.WriteLine("End");
        }

        public  UserCredential GetUserCredential()
        {
            using (var stream = new FileStream("credentials.json", FileMode.Open, FileAccess.Read))
            {
                string creadPath = Environment.GetFolderPath(Environment.SpecialFolder.Personal);
                creadPath = Path.Combine(creadPath, "driveApiCredentials", "drive-credentials.json");

                return GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.FromStream(stream).Secrets,
                    Scopes,
                    "User",
                    CancellationToken.None,
                    new FileDataStore(creadPath, true)).Result;
            }
        }

        public DriveService GetDriveService(UserCredential credential)
        {
            return new DriveService(
                new BaseClientService.Initializer()
                {
                    HttpClientInitializer = credential,
                    ApplicationName = ApplicationName
                }
            );
        }
    }
}
