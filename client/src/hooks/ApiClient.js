import { axios } from "axios";
import { useUser } from "./useUser";

export const ApiClient = () => {
    const { user, replaceToken } = useUser();
    const api = axios.create({
        baseURL: "http://localhost:4000/api",
        headers: {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        },
    });

    api.interceptors.request.use(
        (config) => {
            const token = user?.accessToken;
            if(token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            const originalRequest = error.config;
            if(user.refreshToken && error.response.status === 401) {
                let data = JSON.stringify({refreshToken: user.refreshToken});
                try {
                    const result = post("/token", data);
                    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
                    const response = api(originalRequest).then(response => {return response});
                    replaceToken(result.accessToken);
                    return response;
                } catch(error) {
                    console.error(error);
                }
            }
            return Promise.reject(error);
        }
    );

    const get = (path) => {
        return api.get(path).then((response) => response.data);
    };
    
    const post = (path, data) => {
        return api.post(path, data).then((response) => response.data);
    };

    const put = (path, data) => {
        return api.put(path, data).then((response) => response.data);
    };

    const del = (path) => {
        return api.delete(path).then((response) => response);
    };

    return {
        get,
        post,
        put,
        del
    }
}