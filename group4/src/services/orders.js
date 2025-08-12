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
export const getOrders = async (id) => {
  try {
    const res = await instance.get(endpoint.ORDERS + `${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }

};

export const createOrder = async (value) => {
  try {
    const res = await instance.post(endpoint.ORDERS, value);
    return res.data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getOrdersByUserId = async (userId) => {
  try {
    const res = await instance.get(endpoint.ORDERS + `?userId=${userId}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }

};
export const removeOrder = async (id) => {
  try {
    const res = await instance.delete(endpoint.ORDERS + `${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }

};

