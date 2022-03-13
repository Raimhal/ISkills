using BLL.DtoModels;
using Domain.Models;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IGoogleDriveService 
    {
        void Main();
        UserCredential GetUserCredential();
        DriveService GetDriveService(UserCredential credential);
    }
}
