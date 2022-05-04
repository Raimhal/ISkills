import EntityService from "./EntityService";


export  default class UserService {
    static async getUsers(config = {}) {
        const response = await EntityService.Get('/users', config)
        const users = response.data
        const totalCount = response.headers['x-total-count']
        return [totalCount, users]
    }

    static async Login(data) {
        const response = await EntityService.Create('/account/authenticate', data)
        return response.data
    }

    static async getCurrentUser(config = {}) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        const response = await EntityService.Get(`/users/${currentUser.userId}/short-information`, config)
        console.log(response.data)
        return response.data
    }

    static async updateUser(id, data, config={}) {
        await EntityService.Update(`/users/${id}`, data, config)
    }

    static async Create(data, config = {}){
        const response = await EntityService.Create('/users', data, config)
        return response.data
    }
}