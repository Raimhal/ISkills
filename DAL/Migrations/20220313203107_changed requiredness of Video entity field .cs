using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace DAL.Migrations
{
    public partial class changedrequirednessofVideoentityfield : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.CreateTable(
            //    name: "AllowedFileTypes",
            //    columns: table => new
            //    {
            //        Id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        FileType = table.Column<string>(type: "text", nullable: false),
            //        FileSize = table.Column<double>(type: "double precision", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_AllowedFileTypes", x => x.Id);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Categories",
            //    columns: table => new
            //    {
            //        Id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Categories", x => x.Id);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Roles",
            //    columns: table => new
            //    {
            //        Id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        Name = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Roles", x => x.Id);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Users",
            //    columns: table => new
            //    {
            //        Id = table.Column<Guid>(type: "uuid", nullable: false),
            //        FirstName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
            //        LastName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
            //        UserName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
            //        Email = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
            //        Password = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
            //        Salt = table.Column<string>(type: "text", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Users", x => x.Id);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Themes",
            //    columns: table => new
            //    {
            //        Id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
            //        CategoryId = table.Column<int>(type: "integer", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Themes", x => x.Id);
            //        table.ForeignKey(
            //            name: "FK_Themes_Categories_CategoryId",
            //            column: x => x.CategoryId,
            //            principalTable: "Categories",
            //            principalColumn: "Id",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "RefreshTokens",
            //    columns: table => new
            //    {
            //        Id = table.Column<Guid>(type: "uuid", nullable: false),
            //        Token = table.Column<string>(type: "text", nullable: true),
            //        Expires = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
            //        Created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
            //        CreatedByIp = table.Column<string>(type: "text", nullable: true),
            //        Revoked = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
            //        RevokedByIp = table.Column<string>(type: "text", nullable: true),
            //        ReplaceByToken = table.Column<string>(type: "text", nullable: true),
            //        UserId = table.Column<Guid>(type: "uuid", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_RefreshTokens", x => x.Id);
            //        table.ForeignKey(
            //            name: "FK_RefreshTokens_Users_UserId",
            //            column: x => x.UserId,
            //            principalTable: "Users",
            //            principalColumn: "Id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "RoleUser",
            //    columns: table => new
            //    {
            //        RolesId = table.Column<int>(type: "integer", nullable: false),
            //        UsersId = table.Column<Guid>(type: "uuid", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_RoleUser", x => new { x.RolesId, x.UsersId });
            //        table.ForeignKey(
            //            name: "FK_RoleUser_Roles_RolesId",
            //            column: x => x.RolesId,
            //            principalTable: "Roles",
            //            principalColumn: "Id",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_RoleUser_Users_UsersId",
            //            column: x => x.UsersId,
            //            principalTable: "Users",
            //            principalColumn: "Id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Courses",
            //    columns: table => new
            //    {
            //        Id = table.Column<Guid>(type: "uuid", nullable: false),
            //        Title = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
            //        ShortInfo = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
            //        Requirements = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
            //        Description = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
            //        Language = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
            //        DateCreated = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
            //        DateUpdated = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
            //        Price = table.Column<float>(type: "real", nullable: true),
            //        ThemeId = table.Column<int>(type: "integer", nullable: true),
            //        CreatorId = table.Column<Guid>(type: "uuid", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Courses", x => x.Id);
            //        table.ForeignKey(
            //            name: "FK_Courses_Themes_ThemeId",
            //            column: x => x.ThemeId,
            //            principalTable: "Themes",
            //            principalColumn: "Id",
            //            onDelete: ReferentialAction.Restrict);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Chapters",
            //    columns: table => new
            //    {
            //        Id = table.Column<Guid>(type: "uuid", nullable: false),
            //        Title = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
            //        Description = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
            //        CourseId = table.Column<Guid>(type: "uuid", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Chapters", x => x.Id);
            //        table.ForeignKey(
            //            name: "FK_Chapters_Courses_CourseId",
            //            column: x => x.CourseId,
            //            principalTable: "Courses",
            //            principalColumn: "Id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "Comments",
            //    columns: table => new
            //    {
            //        Id = table.Column<Guid>(type: "uuid", nullable: false),
            //        Content = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
            //        Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
            //        DateUpdated = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
            //        CourseId = table.Column<Guid>(type: "uuid", nullable: false),
            //        CreatorId = table.Column<Guid>(type: "uuid", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Comments", x => x.Id);
            //        table.ForeignKey(
            //            name: "FK_Comments_Courses_CourseId",
            //            column: x => x.CourseId,
            //            principalTable: "Courses",
            //            principalColumn: "Id",
            //            onDelete: ReferentialAction.Restrict);
            //        table.ForeignKey(
            //            name: "FK_Comments_Users_CreatorId",
            //            column: x => x.CreatorId,
            //            principalTable: "Users",
            //            principalColumn: "Id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "CourseUser",
            //    columns: table => new
            //    {
            //        CoursesId = table.Column<Guid>(type: "uuid", nullable: false),
            //        StudentsId = table.Column<Guid>(type: "uuid", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_CourseUser", x => new { x.CoursesId, x.StudentsId });
            //        table.ForeignKey(
            //            name: "FK_CourseUser_Courses_CoursesId",
            //            column: x => x.CoursesId,
            //            principalTable: "Courses",
            //            principalColumn: "Id",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_CourseUser_Users_StudentsId",
            //            column: x => x.StudentsId,
            //            principalTable: "Users",
            //            principalColumn: "Id",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            migrationBuilder.CreateTable(
                name: "Videos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    ChapterId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Videos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Videos_Chapters_ChapterId",
                        column: x => x.ChapterId,
                        principalTable: "Chapters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            //migrationBuilder.CreateIndex(
            //    name: "IX_AllowedFileTypes_Id",
            //    table: "AllowedFileTypes",
            //    column: "Id",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_Categories_Id_Title",
            //    table: "Categories",
            //    columns: new[] { "Id", "Title" },
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_Chapters_CourseId",
            //    table: "Chapters",
            //    column: "CourseId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Chapters_Id",
            //    table: "Chapters",
            //    column: "Id",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_Comments_CourseId",
            //    table: "Comments",
            //    column: "CourseId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Comments_CreatorId",
            //    table: "Comments",
            //    column: "CreatorId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Comments_Id",
            //    table: "Comments",
            //    column: "Id",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_Courses_Id",
            //    table: "Courses",
            //    column: "Id",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_Courses_ThemeId",
            //    table: "Courses",
            //    column: "ThemeId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_CourseUser_StudentsId",
            //    table: "CourseUser",
            //    column: "StudentsId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_RefreshTokens_Id",
            //    table: "RefreshTokens",
            //    column: "Id",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_RefreshTokens_UserId",
            //    table: "RefreshTokens",
            //    column: "UserId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_RoleUser_UsersId",
            //    table: "RoleUser",
            //    column: "UsersId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Themes_CategoryId",
            //    table: "Themes",
            //    column: "CategoryId");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Themes_Id_Title",
            //    table: "Themes",
            //    columns: new[] { "Id", "Title" },
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_Users_Id_Email",
            //    table: "Users",
            //    columns: new[] { "Id", "Email" },
            //    unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Videos_ChapterId",
                table: "Videos",
                column: "ChapterId");

            migrationBuilder.CreateIndex(
                name: "IX_Videos_Id",
                table: "Videos",
                column: "Id",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AllowedFileTypes");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "CourseUser");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "RoleUser");

            migrationBuilder.DropTable(
                name: "Videos");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Chapters");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "Themes");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
