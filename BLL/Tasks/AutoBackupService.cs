using BLL.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Tasks
{
    public class AutoBackupService : IHostedService
    {
        private Timer _timer;
        private readonly IServiceProvider _services;

        public AutoBackupService(IServiceProvider serviceProvider) 
            => _services = serviceProvider;

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(
                new TimerCallback(AutoDatabaseAction),
                 null,
                 TimeSpan.Zero,
                 TimeSpan.FromDays(7)
                 );
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {

            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        private void AutoDatabaseAction(object _)
        {
            using var scope = _services.CreateScope();
            var databaseService = scope.ServiceProvider.GetRequiredService<IDatabaseService>();
            string postgresqlPath = @"E:\Postgesql\bin";
            string databaseName = "ISkillsDB";
            string outputDirectoryPath = @"E:\it\Secound Course\ISkills\backend";
            string username = "postgres";
            string password = "Epidemic2021";
            string host = "127.0.0.1";
            string port = "5432";
            databaseService.BackupDatabase(postgresqlPath, outputDirectoryPath, databaseName, username, password, host, port);

        }
    }
}