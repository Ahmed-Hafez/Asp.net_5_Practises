using AutoMapper;
using BookStore.API.Data;
using BookStore.API.Helpers;
using BookStore.API.Models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.API.Repository
{
    public class BookRepository : IBookRepository
    {
        private readonly BookStoreDbContext context;
        private readonly IMapper mapper;

        public BookRepository(BookStoreDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<List<BookModel>> GetAllBooksAsync()
        {
            //return await context.Books.Select(b => new BookModel()
            //{
            //    ID = b.ID,
            //    Title = b.Title,
            //    Description = b.Description,
            //}).ToListAsync();
            return await context.Books.Select(book => mapper.Map<BookModel>(book)).ToListAsync();
        }

        public async Task<BookModel> GetBookByIdAsync(int id)
        {
            //return await context.Books.Where(b => b.ID == id).Select(b => new BookModel()
            //{
            //    ID = b.ID,
            //    Title = b.Title,
            //    Description = b.Description
            //}).FirstOrDefaultAsync();

            var book = await context.Books.FindAsync(id);
            return mapper.Map<BookModel>(book);
        }

        public async Task<int> AddBookAsync(BookModel model)
        {
            var book = new Book() { Title = model.Title, Description = model.Description };
            await context.Books.AddAsync(book);
            await context.SaveChangesAsync();
            return book.ID;
        }

        public async Task<int> UpdateBookAsync(BookModel model)
        {
            // ----------------- FIRST WAY ---------------
            //var book = await context.Books.SingleOrDefaultAsync(b => b.ID == model.ID);

            //book.Title = model.Title;
            //book.Description = model.Description;

            // ----------------- SECOND WAY ---------------
            //Book book = new Book() { ID = model.ID, Title = model.Title, Description = model.Description };

            // ----------------- THIRD WAY ---------------
            Book book = mapper.Map<Book>(model);
            context.Update(book);
            
            await context.SaveChangesAsync();

            return model.ID;
        }

        public async Task<int> PatchBookAsync(int id, JsonPatchDocument model)
        {
            throw new NotImplementedException();
        }


        public async Task DeleteBookAsync(int id)
        {
            var b = await context.Books.Where(b => b.ID == id).FirstOrDefaultAsync();
            context.Remove(b);
            await context.SaveChangesAsync();
        }
    }
}
