using AutoMapper;

namespace BLL.Mapping
{
    public interface IMapWith<T>
    {
        void Mapping(Profile profile) =>
            profile.CreateMap(typeof(T), GetType());
    }
}
