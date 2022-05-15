import EntityService from "./EntityService";
import {instance} from "../router/instance";


export  default class ChapterService {
    static async GetChapters(config = {}) {
        const response = await EntityService.Get('/chapters', config)
        const chapters = response.data
        const totalCount = response.headers['x-total-count']
        return [totalCount, chapters]
    }

    static async GetChapter(id, config ={}) {
        const path = `/chapters/${id}`
        return (await EntityService.Get(path, config)).data
    }

    static async Create(data, config = {}){
        const response = await EntityService.Create('/chapters', data, config)
        return response.data
    }

    static async Update(id, data, config = {}) {
        const path = `/chapters/${id}`
        console.log(data)
        await EntityService.Update(path, data, config)
    }

    static async Delete(id) {
        const path = `/chapters/${id}`
        await EntityService.Delete(path)
    }
}