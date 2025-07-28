import { endpoint } from "./endpoint";
import instance from "./index";
export const getAllCategories = async()=>{
    try {
const res = await instance.get(endpoint.CATEGORIES)
    return res.data;

    } catch (err) {
        console.log(err)
         return [];
    }
}