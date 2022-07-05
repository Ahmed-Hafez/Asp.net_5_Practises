using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository repository;
        private readonly IPhotoService photoService;
        private readonly IMapper mapper;

        public UsersController(IUserRepository repository, IPhotoService photoService, IMapper mapper)
        {
            this.repository = repository;
            this.photoService = photoService;
            this.mapper = mapper;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await repository.GetMembersAsync();

            return Ok(users);
        }

        // [HttpGet("{id}")]
        // public async Task<IActionResult> GetUserById(int id)
        // {
        //     var user = await repository.GetUserByIdAsync(id);
        //     return Ok(user);
        // }

        [HttpGet("{username}", Name = "GetUser")]
        public async Task<IActionResult> GetUserById(string username)
        {
            var user = await repository.GetMemberAsync(username);

            return Ok(user);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var user = await repository.GetUserByUsernameAsync(User.GetUsername());

            mapper.Map(memberUpdateDto, user);

            repository.Update(user);

            if (await repository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<IActionResult> AddPhoto(IFormFile file)
        {
            var user = await repository.GetUserByUsernameAsync(User.GetUsername());

            var result = await photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            Photo photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0) photo.IsMain = true;

            user.Photos.Add(photo);

            if (await repository.SaveAllAsync())
            {
                return CreatedAtRoute("GetUser", new { username = user.Username }, mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Unexpected error when uploading photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<IActionResult> SetMainPhoto(int photoId)
        {
            var user = await repository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);

            if (photo.IsMain) return BadRequest("This already the main photo");

            var currentMainPhoto = user.Photos.FirstOrDefault(photo => photo.IsMain);

            if (currentMainPhoto != null) currentMainPhoto.IsMain = false;

            photo.IsMain = true;

            if (await repository.SaveAllAsync()) return NoContent();

            return BadRequest("Faild to set main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<IActionResult> DeletePhoto(int photoId)
        {
            var user = await repository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);

            if (photo == null) return NotFound();

            if (photo.IsMain) return BadRequest("Cannot delete main photo");

            if (photo.PublicId != null)
            {
                var deleteResult = await photoService.DeletePhotoAsync(photo.PublicId);

                if (deleteResult.Error != null)
                {
                    return BadRequest($"Unexpected error when deleting photo {deleteResult.Error.Message}");
                }
            }

            user.Photos.Remove(photo);

            if (await repository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to delete the photo");
        }
    }
}