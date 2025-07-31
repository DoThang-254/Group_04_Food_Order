import  { endpoint } from "./endpoint";
import instance from "./index";
export const getAllProducts = async()=>{
    try {
const res = await instance.get(endpoint.PRODUCTS)
    return res.data;

    } catch (err) {
        console.log(err)
         
    }
}
export const getAnProduct = async(id)=>{
    try {
const res = await instance.get(endpoint.PRODUCTS + id)
    return res.data;

    } catch (err) {
        console.log(err)
         
    }
}