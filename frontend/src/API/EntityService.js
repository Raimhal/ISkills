import {instance} from "../router/instance";

export default class EntityService {
    static async getAll(path, config) {
        return await instance.get(path, config)
    }

    static async getEntity(id, path, config) {
        return await instance.get(`${path}/${id}`, config)
    }

}