using BookStore.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BookStore.API.Data
{
    public class BookStoreDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Book> Books { get; set; }
        public BookStoreDbContext(DbContextOptions<BookStoreDbContext> options)
            : base(options)
        {

        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer("Server=.;Database=BookStore;Integrated Sercurity=True");
        //    base.OnConfiguring(optionsBuilder);
        //}
    }
}
