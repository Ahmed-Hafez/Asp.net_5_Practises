using System.Text;
using System.Security.Cryptography;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using AutoMapper;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext context;
        private readonly ITokenService tokenService;
        private readonly IMapper mapper;

        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
        {
            this.context = context;
            this.tokenService = tokenService;
            this.mapper = mapper;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (await UserExist(registerDto.Username))
                return BadRequest("Username is Taken");


            using var hmac = new HMACSHA512();
            AppUser user = mapper.Map<AppUser>(registerDto);
            user.Username = registerDto.Username.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hmac.Key;

            context.Users.Add(user);

            await context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Username = user.Username,
                KnownAs = user.KnownAs,
                Token = tokenService.CreateToken(user)
            };

            return CreatedAtAction(nameof(UsersController.GetUsers), "Users", new { id = user.Id }, userDto);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await context.Users
                .Include(u => u.Photos)
                .SingleOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null)
                return Unauthorized("Invalid Username or Password");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            if (computedHash.Length == user.PasswordHash.Length)
            {
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != user.PasswordHash[i])
                    {
                        return Unauthorized("Invalid Username or Password");
                    }
                }
            }

            var userDto = new UserDto
            {
                Username = user.Username,
                KnownAs = user.KnownAs,
                Token = tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(photo => photo.IsMain)?.Url
            };

            return Ok(userDto);
        }

        private async Task<bool> UserExist(string username)
        {
            return await context.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower());
        }
    }
}