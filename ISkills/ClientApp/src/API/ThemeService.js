import EntityService from "./EntityService";


export  default class ThemeService {
    static async GetThemes(config = {}) {
        console.log('themes')
        const response = await EntityService.Get('/themes', config)
        const themes = response.data
        const totalCount = response.headers['x-total-count']
        return [totalCount, themes]
    }

    static async GetThemesAll(config = {}) {
        const path = `/themes/all`
        const response = await EntityService.Get(path, config)
        return response.data
    }

    static async GetTheme(id, config ={}) {
        const path = `/themes/${id}`
        return (await EntityService.Get(path, config)).data
    }

    static async Create(data, config = {}){
        const response = await EntityService.Create('/themes', data, config)
        return response.data
    }

    static async Update(id, data, config = {}) {
        const path = `/themes/${id}`
        await EntityService.Update(path, data, config)
    }

    static async Delete(id) {
        const path = `/themes/${id}`
        await EntityService.Delete(path)
    }
}