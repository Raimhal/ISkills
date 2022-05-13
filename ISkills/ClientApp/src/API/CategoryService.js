import EntityService from "./EntityService";


export  default class CategoryService {
    static async GetCategories(config = {}) {
        const response = await EntityService.Get('/categories', config)
        const categories = response.data
        const totalCount = response.headers['x-total-count']
        return [totalCount, categories]
    }

    static async GetCategoriesAll(config = {}) {
        const response = await EntityService.Get('/categories/all', config)
        return response.data
    }

    static async GetCategory(id, config ={}) {
        const path = `/categories/${id}`
        return (await EntityService.Get(path, config)).data
    }

    static async Create(data, config = {}){
        const response = await EntityService.Create('/categories', data, config)
        return response.data
    }

    static async Update(id, data, config = {}) {
        const path = `/categories/${id}`
        await EntityService.Update(path, data, config)
    }
}