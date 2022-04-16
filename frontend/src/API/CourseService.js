import EntityService from "./EntityService";


export  default class CourseService {
    static async getAll(config = {}) {
        const response = await EntityService.Get('/courses', config)
        const courses = response.data
        const totalCount = response.headers['x-total-count']
        return [totalCount, courses]
    }

    static async getOne(id, config ={}) {
        const path = `/courses/${id}`
        return (await EntityService.Get(path, config)).data
    }

    static async Create(data, config = {}){
        const response = await EntityService.Create('/courses', data, config)
        return response.data
    }
}