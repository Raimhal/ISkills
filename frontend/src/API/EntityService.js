import {instance} from "../router/instance";

export default class EntityService {
    static async Get(path, config = {}) {
        return await instance.get(path, config)
    }

    static async Create(path, data, config = {}) {
        return await instance.post(path, data, config)
    }

    static async Update(path, data, config = {}){
        await instance.put(path, data, config)
    }

}