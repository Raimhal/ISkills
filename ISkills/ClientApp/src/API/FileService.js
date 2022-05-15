import EntityService from "./EntityService";


export  default class FileService {
    static async GetFileTypes(config = {}) {
        const response = await EntityService.Get('/file-types', config)
        const filesTypes = response.data
        const totalCount = response.headers['x-total-count']
        return [totalCount, filesTypes]
    }

    static async GetFileType(id, config ={}) {
        const path = `/file-types'/${id}`
        return (await EntityService.Get(path, config)).data
    }

    static async Create(data, config = {}){
        const response = await EntityService.Create('/file-types', data, config)
        return response.data
    }

    static async Update(id, data, config = {}) {
        const path = `/file-types/${id}`
        await EntityService.Update(path, data, config)
    }

    static async Delete(id) {
        const path = `/file-types/${id}`
        await EntityService.Delete(path)
    }
}