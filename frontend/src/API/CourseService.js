import EntityService from "./EntityService";
import {instance} from "../router/instance";


export  default class CourseService {
    static async GetCourses(config = {}) {
        const response = await EntityService.Get('/courses', config)
        const courses = response.data
        const totalCount = response.headers['x-total-count']
        return [totalCount, courses]
    }

    static async GetCourse(id, config ={}) {
        const path = `/courses/${id}`
        return (await EntityService.Get(path, config)).data
    }

    static async Create(data, config = {}){
        const response = await EntityService.Create('/courses', data, config)
        return response.data
    }

    static async Update(id, data, config = {}) {
        const path = `/courses/${id}`
        await EntityService.Update(path, data, config)
    }

    static async Delete(id) {
        const path = `/courses/${id}`
        await EntityService.Delete(path)
    }

    static async ToggleAssignment(id){
        const path = `/courses/${id}/assignment`
        await EntityService.Patch(path)
    }
}