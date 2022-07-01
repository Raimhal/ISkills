import EntityService from "./EntityService";


export default class PurchaseService {

    static async GetPurchasesPurchase(config = {}) {
        const path = `/purchases/grouped`
        const response = await EntityService.Get(path, config)
        return response.data
    }

    static async GenerateClientToken(){
        return (await EntityService.Create("/purchases/generateClientToken")).data
    }
}