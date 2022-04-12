import {string} from "yup";
import {instance} from "../router/instance";
import EntityService from "./EntityService";


export  default class CourseService {
    static async getAll(config) {
        const response = await EntityService.getAll('/courses', config)
        const courses = response.data
        const totalCount = response.headers['x-total-count']
        courses.map(course => {
                if (!course.imageUrl)
                    course.imageUrl = 'defaultCourseImage.png'
            }
        )
        return [totalCount, courses]
    }

    static async getOne(id, config ={}) {
        return await EntityService.getEntity(id, '/courses', config)
    }
}