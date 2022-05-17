import EntityService from "./EntityService";


export  default class VideoService {
    static async GetVideos(config = {}) {
        const response = await EntityService.Get('/videos', config)
        const videos = response.data
        const totalCount = response.headers['x-total-count']
        return [totalCount, videos]
    }

    static async GetVideo(id, config ={}) {
        const path = `/videos/${id}`
        return await EntityService.Get(path, config)
    }

    static async Create(video, config = {}){
        const formData = new FormData()
        formData.append("file", video.file, video.file.name)
        formData.append("title", video.title)
        formData.append("chapterId", video.chapterId)
        const response =  await EntityService.Create('/videos', formData, config)
        return response
    }

    static async Update(video, config = {}) {
        const path = `/videos/${video.id}`
        const formData = new FormData()
        formData.append("file", video.file, video.file.name)
        formData.append("title", video.title)
        formData.append("chapterId", video.chapterId)
        await EntityService.Update(path, formData, config)
    }

    static async Delete(id) {
        const path = `/videos/${id}`
        await EntityService.Delete(path)
    }
}