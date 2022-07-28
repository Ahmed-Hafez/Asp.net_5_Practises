using System.Linq.Expressions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            ConvertAge_PhotoUrlFromAppUserToDto(CreateMap<AppUser, MemberDto>);
            // CreateMap<AppUser, MemberDto>()
            //     .ForMember(
            //         dest => dest.PhotoUrl,
            //         options => options.MapFrom(
            //             src => src.Photos.FirstOrDefault(photo => photo.IsMain).Url
            //         )
            //     )
            //     .ForMember(
            //         dest => dest.Age,
            //         options => options.MapFrom(
            //             src => src.DateOfBirth.CalculateAge()
            //         )
            //     );

            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<Photo, PhotoDto>();
            CreateMap<RegisterDto, AppUser>();

            ConvertAge_PhotoUrlFromAppUserToDto(CreateMap<AppUser, LikeDto>);
            // CreateMap<AppUser, LikeDto>()
            //     .ForMember(
            //         dest => dest.PhotoUrl,
            //         options => options.MapFrom(
            //             src => src.Photos.FirstOrDefault(photo => photo.IsMain).Url
            //         )
            //     )
            //     .ForMember(
            //         dest => dest.Age,
            //         options => options.MapFrom(
            //             src => src.DateOfBirth.CalculateAge()
            //         )
            //     );

            CreateMap<Message, MessageDto>()
                .ForMember(
                    dest => dest.SenderPhotoUrl,
                    opt => opt.MapFrom(
                        src => src.Sender.Photos.FirstOrDefault(x => x.IsMain).Url
                    )
                )
                .ForMember(
                    dest => dest.RecipientPhotoUrl,
                    opt => opt.MapFrom(
                        src => src.Recipient.Photos.FirstOrDefault(x => x.IsMain).Url
                    )
                );

        }

        private void ConvertAge_PhotoUrlFromAppUserToDto<T>(Func<IMappingExpression<AppUser, T>> conversionMap)
        {
            var typeParam = Expression.Parameter(typeof(T));
            var body_photoUrl = Expression.Convert(Expression.Property(typeParam, "PhotoUrl"), typeof(object));
            var body_age = Expression.Convert(Expression.Property(typeParam, "age"), typeof(object));
            var photoUrlExpression = Expression.Lambda<Func<T, object>>(body_photoUrl, typeParam);
            var ageExpression = Expression.Lambda<Func<T, object>>(body_age, typeParam);

            conversionMap()
                .ForMember(
                    photoUrlExpression,
                    options => options.MapFrom(
                        src => src.Photos.FirstOrDefault(photo => photo.IsMain).Url
                    )
                )
                .ForMember(
                    ageExpression,
                    options => options.MapFrom(
                        src => src.DateOfBirth.CalculateAge()
                    )
                );
        }

    }
}