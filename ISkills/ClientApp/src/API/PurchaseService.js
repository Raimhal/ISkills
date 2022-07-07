import EntityService from "./EntityService";


export default class PurchaseService {

    static async GetPurchasesStatistic(config = {}) {
        const path = `/purchases/grouped`
        const response = await EntityService.Get(path, config)
        return response.data
    }

    static async GetYearPurchasesStatistic(config = {}) {
        const path = `/purchases/grouped-year`
        const response = await EntityService.Get(path, config)
        return response.data
    }

    static async GenerateClientToken(){
        return (await EntityService.Create("/purchases/generateClientToken")).data
    }
}