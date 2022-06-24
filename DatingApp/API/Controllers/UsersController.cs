using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {

        public UsersController(DataContext context) : base(context)
        {

        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsers(int id)
        {
            var user = await context.Users.FindAsync(id);
            return Ok(user);
        }
    }
}