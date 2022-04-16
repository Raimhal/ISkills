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
        const response = await EntityService.Get('/users/current', config)
        return response.data
    }

    static async updateUser(data, config={}) {
        await EntityService.Update(`/users/${data.id}`, data, config)
    }
}