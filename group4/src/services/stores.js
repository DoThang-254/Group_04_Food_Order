import { endpoint } from "./endpoint";
import instance from "./index";
export const getAllStores = async () => {
  try {
    const res = await instance.get(endpoint.STORES);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getAnStore = async (id) => {
  try {
    const res = await instance.get(endpoint.STORES + id);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const postStore = async (data) => {
  try {
    const res = await instance.post(endpoint.STORES, data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getStoreByOwnerId = async (ownerId) => {
  const res = await instance.get(`${endpoint.STORES}?ownerId=${ownerId}`);
  return res.data[0]; 
};

export const getStoreByOwnerIdAndChecking = async (ownerId) => {
  const res = await instance.get(`${endpoint.STORES}?ownerId=${ownerId}`);
  return {
    user : res.data[0] ,
    msg : res.data[0]?.state ? '' : 'Your store is not active'
  }; 
};
