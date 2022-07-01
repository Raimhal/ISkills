import EntityService from "./EntityService";


export default class BackupService {

    static async GetBackups(config = {}) {
        const path = `/database/backups`
        const response = await EntityService.Get(path, config)
        const totalCount = response.headers['x-total-count']
        return [totalCount, response.data]
    }

    static async CreateBackup(config = {}){
        const response = await EntityService.Create('/database/backup', {}, config)
        return response.data
    }

    static async ExecuteRestore(config = {}){
        await EntityService.Create('/database/restore', {}, config)
    }

    static async Delete(url) {
        const path = `/database/backup?backupUrl=${url}`
        await EntityService.Delete(path)
    }
}