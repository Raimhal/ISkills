import EntityService from "./EntityService";


export default class StatisticService {

    static async GetPurchasesStatistic(config = {}) {
        const path = `/purchases/grouped`
        const response = await EntityService.Get(path, config)
        return response.data
    }
}