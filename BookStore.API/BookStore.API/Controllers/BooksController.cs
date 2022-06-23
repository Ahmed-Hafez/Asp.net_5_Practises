using BookStore.API.Models;
using BookStore.API.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BookStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IBookRepository repository;

        public BooksController(IBookRepository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await repository.GetAllBooksAsync();

            return Ok(books);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookById([FromRoute] int id)
        {
            var book = await repository.GetBookByIdAsync(id);

            return book == null ? NotFound() : Ok(book);
        }

        [HttpPost]
        public async Task<IActionResult> AddBook([FromBody] BookModel book)
        {
            var bookId = await repository.AddBookAsync(book);

            return CreatedAtAction(nameof(GetBookById), new {id = bookId, controller = "books" }, bookId);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateBook([FromBody] BookModel book)
        {
            var id = await repository.UpdateBookAsync(book);

            return Ok(id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            await repository.DeleteBookAsync(id);
            return Ok();
        }
    }
}
