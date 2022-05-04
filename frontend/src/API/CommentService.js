import EntityService from "./EntityService";


export default class CommentService {

    static async GetComments(config = {}) {
        const path = `/comments`
        const response = await EntityService.Get(path, config)
        const totalCount = response.headers['x-total-count']
        return [totalCount, response.data]
    }

    static async GetComment(id, config ={}) {
        const path = `/comments/${id}`
        return (await EntityService.Get(path, config)).data
    }

    static async Create(data, config = {}){
        const response = await EntityService.Create('/comments', data, config)
        return response.data
    }

    static async Update(id, data, config = {}) {
        const path = `/comments/${id}`
        await EntityService.Update(path, data, config)
    }

    static async Delete(id) {
        const path = `/comments/${id}`
        await EntityService.Delete(path)
    }
}