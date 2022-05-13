import EntityService from "./EntityService";


export  default class FileService {
    static async GetFileTypes(config = {}) {
        const response = await EntityService.Get('/file-types', config)
        const filesTypes = response.data
        const totalCount = response.headers['x-total-count']
        return [totalCount, filesTypes]
    }
}