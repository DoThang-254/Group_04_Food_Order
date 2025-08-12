import { comparePassword } from "../data/util";
import { endpoint } from "./endpoint";
import instance from "./index";
import { getStoreByOwnerId } from "./stores";
export const login = async (data) => {
    try {
        const res = await instance.get(endpoint.USERS + `?email=${data.email}`);
        const checkStore = await getStoreByOwnerId(data.id);
        console.log(checkStore)
        if (res.data.length > 0) {
            const user = res.data[0];
            const check = await comparePassword(data.password, user.password);
            if (!check) {
                return {
                    user: null,
                    msg: 'Email or password is wrong'
                }

            }
            return {
                user: user,
                msg: user.active ? null : 'Please wait for activation'
            }
        }
        else {
            return {
                user: null,
                msg: 'Email or password is wrong'
            };
        }
    } catch (err) {
        console.log(err)

    }
}
export const loginByGoogle = async (data) => {
    try {
        const res = await instance.get(endpoint.USERS + `?email=${data.email}`);
        const checkStore = await getStoreByOwnerId(data.id);
        console.log(checkStore)
        if (res.data.length > 0) {
            const user = res.data[0];
            if (!user) {
                return {
                    user: null,
                    msg: 'Email or password is wrong'
                }

            }
            return {
                user: user,
                msg: user.active ? null : 'Please wait for activation'
            }
        }
        else {
            return {
                user: null,
                msg: 'Email or password is wrong'
            };
        }
    } catch (err) {
        console.log(err)

    }
}
export const register = async (data) => {
    try {
        const res = await instance.post(endpoint.USERS, data)
        return res.data;
    } catch (err) {
        console.log(err)

    }
}

export const getAllUsers = async () => {
    try {
        const res = await instance.get(endpoint.USERS);
        return res.data;
    } catch (err) {
        console.log(err);
        return [];
    }
};
export const checkEmail = async (email) => {
    try {
        const res = await instance.get(endpoint.USERS + `?email=${email}`);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const updateUser = async (id, updateData) => {
    try {
        const res = await instance.patch(endpoint.USERS + `/${id}`, updateData);
        return res.data;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const saveRequest = async (email) => {
    try {
        await instance.post(endpoint.REQUEST, {
            email,
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        console.log(error);
    }

}

export const checkEmailForgot = async (email) => {
    try {
        const res = await instance.get(endpoint.REQUEST + `?email=${email}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const removeRequest = async (id) => {
    try {
        await instance.delete(endpoint.REQUEST + `/${id}`);
    } catch (error) {
        console.log(error);
    }
}