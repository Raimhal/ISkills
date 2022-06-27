import EntityService from "./EntityService";


export  default class UserService {
    static async GetUsers(config = {}) {
        const response = await EntityService.Get('/users', config)
        const users = response.data
        const totalCount = response.headers['x-total-count']
        return [totalCount, users]
    }

    static async Login(data) {
        const response = await EntityService.Create('/account/authenticate', data)
        return response.data
    }

    static async RefreshToken(){
        const response = await EntityService.Create('/account/refresh-token')
        return response.data
    }

    static async getCurrentUser(config = {}) {
        const response = await EntityService.Get(`/users/current`, config)
        return response.data
    }

    static async Update(id, data, config={}) {
        await EntityService.Update(`/users/${id}`, data, config)
    }

    static async UpdateUserImage(id, image, config = {}){
        const formData = new FormData()
        formData.append("file", image, image.name)
        const response =  await EntityService.Patch(`/users/${id}`, formData, config)
        return response.data
    }

    static async Create(data, config = {}){
        const response = await EntityService.Create('/users', data, config)
        return response.data
    }
    static async Delete(id) {
        const path = `/users/${id}`
        await EntityService.Delete(path)
    }
}