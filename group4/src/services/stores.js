import { endpoint } from "./endpoint";
import instance from "./index";
export const getAllStores = async () => {
    try {
        const res = await instance.get(endpoint.STORES)
        return res.data;

    } catch (err) {
        console.log(err)

    }
}

export const postStore = async (data) => {
    try {
        const res = await instance.post(endpoint.STORES, data)
        return res.data;

    } catch (err) {
        console.log(err)

    }
}