using API.Data.Enums;

namespace API.Helpers
{
    public class LikesParams : PaginationParams
    {
        public int UserId { get; set; }
        public LikeType LikeType { get; set; }
    }
}