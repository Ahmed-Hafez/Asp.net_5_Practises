using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository userRepository;
        private readonly ILikeRepository likeRepository;

        public LikesController(IUserRepository userRepository, ILikeRepository likeRepository)
        {
            this.userRepository = userRepository;
            this.likeRepository = likeRepository;
        }

        [HttpPost("{username}")]
        public async Task<IActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await userRepository.GetUserByUsernameAsync(username);
            var sourceUser = await likeRepository.GetUserWithLikes(sourceUserId);

            if (likedUser == null) return NotFound();

            if (sourceUser.Username == username) return BadRequest("You cannot like yourself");

            var userLike = await likeRepository.GetUserLike(sourceUserId, likedUser.Id);

            if (userLike != null) return BadRequest("You already like this user");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                LikedUserId = likedUser.Id
            };

            sourceUser.LikedUsers.Add(userLike);

            if (await userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to like user");
        }

        [HttpGet]
        public async Task<IActionResult> GetUserLikes([FromQuery] LikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId();
            var users = await likeRepository.GetUserLikes(likesParams);

            Response.AddPaginationHeader(users.CurrentPage,
                users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);
        }
    }
}