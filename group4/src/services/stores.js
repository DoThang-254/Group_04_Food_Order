import { endpoint } from "./endpoint";
import instance from "./index";

export const getAllStores = async () => {
    try {
        const res = await instance.get(endpoint.STORES);
        return res.data;
    } catch (err) {
        console.log(err);
        return [];
    }
};
