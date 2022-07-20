using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data.Enums;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikeRepository : ILikeRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public LikeRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<UserLike> GetUserLike(int SourceUserId, int LikedUserId)
        {
            return await context.Likes.FindAsync(SourceUserId, LikedUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
        {
            // var users = context.Users.Include(user => user.Photos).OrderBy(u => u.Username).AsQueryable();
            IQueryable<AppUser> users = null;
            var likes = context.Likes.AsQueryable();

            if (likesParams.LikeType == LikeType.Liked)
            {
                likes = likes.Where(l => l.SourceUserId == likesParams.UserId);
                users = likes.Select(l => l.LikedUser);
            }
            else if (likesParams.LikeType == LikeType.LikedBy)
            {
                likes = likes.Where(l => l.LikedUserId == likesParams.UserId);
                users = likes.Select(l => l.SourceUser);
            }

            return await PagedList<LikeDto>
                            .CreateAsync(
                                users.ProjectTo<LikeDto>(mapper.ConfigurationProvider).AsNoTracking(),
                                likesParams.PageNumber,
                                likesParams.PageSize
                            );
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await context.Users
                    .Include(u => u.LikedUsers)
                    .FirstOrDefaultAsync(u => u.Id == userId);
        }
    }
}