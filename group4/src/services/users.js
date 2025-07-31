import { endpoint } from "./endpoint";
import instance from "./index";
import { comparePassword } from "../data/util";
export const login = async (data) => {
    try {
        const res = await instance.get(endpoint.USERS + `?email=${data.email}`);
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
        return res.data.length === 0;
    } catch (err) {
        console.log(err);
        return false;
    }
};

