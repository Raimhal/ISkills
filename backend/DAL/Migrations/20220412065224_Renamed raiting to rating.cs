using Microsoft.EntityFrameworkCore.Migrations;

namespace DAL.Migrations
{
    public partial class Renamedraitingtorating : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Raiting",
                table: "Courses");

            migrationBuilder.AddColumn<double>(
                name: "Rating",
                table: "Courses",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Courses");

            migrationBuilder.AddColumn<float>(
                name: "Raiting",
                table: "Courses",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }
    }
}
