import { endpoint } from "./endpoint";
import instance from "./index";
export const getAllProducts = async () => {
  try {
    const res = await instance.get(endpoint.PRODUCTS);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getAnProduct = async (id) => {
  try {
    const res = await instance.get(endpoint.PRODUCTS + id);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getProductsByStoreId = async (storeId) => {
  const res = await instance.get(`${endpoint.PRODUCTS}?storeId=${storeId}`);
  return res.data;
};

export const addProduct = async (product) => {
  const res = await instance.post(endpoint.PRODUCTS, product);
  return res.data;
};
