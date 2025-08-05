import { endpoint } from "./endpoint";
import instance from "./index";

export const getAllOrders = async () => {
  try {
    const res = await instance.get(endpoint.ORDERS);
    return res.data;
  } catch (err) {
    console.log(err);
    return [];
  }
};
export const getOrders = async () => {
  const res = await instance.get(endpoint.ORDERS);
  return res.data;
};
