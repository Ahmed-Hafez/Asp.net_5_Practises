using BookStore.API.Models;
using Microsoft.AspNetCore.JsonPatch;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookStore.API.Repository
{
    public interface IBookRepository
    {
        Task<List<BookModel>> GetAllBooksAsync();
        Task<BookModel> GetBookByIdAsync(int id);
        Task DeleteBookAsync(int id);
        Task<int> AddBookAsync(BookModel model);
        Task<int> UpdateBookAsync(BookModel model);
        Task<int> PatchBookAsync(int id, JsonPatchDocument model);
    }
}
