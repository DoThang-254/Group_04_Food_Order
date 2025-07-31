import { endpoint } from "./endpoint";
import instance from "./index";

export const getAllCart = async () => {
    try {
        const res = await instance.get(endpoint.CART);
        return res.data;
    } catch (err) {
        console.log(err);
        return [];
    }
};
