import  { endpoint } from "./endpoint";
import instance from "./index";
export const getAllProducts = async()=>{
    try {
const res = await instance.get(endpoint.PRODUCTS)
    return res.data;

    } catch (err) {
        console.log(err)
         return [];
    }
}