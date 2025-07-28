import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:3000/",
    // timeout: 1000,
});

instance.interceptors.request.use(
    function (config) {
        if (localStorage.getItem("token")) {
            config.headers.Authorization = "Bearer " + localStorage.getItem("token");
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {

        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default instance;
