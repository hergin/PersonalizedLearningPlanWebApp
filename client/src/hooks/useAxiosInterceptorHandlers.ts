import { InternalAxiosRequestConfig, AxiosError, AxiosInstance } from "axios";
import { useUser } from "../features/login/hooks/useUser";

export default function useAxiosInterceptorHandlers(axiosInstance: AxiosInstance) {
    const { user, replaceToken } = useUser();

    const onRequest = (config: InternalAxiosRequestConfig) => {
        const token = user?.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
    
    const onResponseError = async (error: AxiosError) => {
        if(!error.config) {
            console.error("AxiosError is missing its configuration, skipping token refresh process...");
            return Promise.reject(error);
        }

        const request = error.config;
        if (user.refreshToken && error.response && error.response.status === 401) {
            const data = JSON.stringify({id: user.id, refreshToken: user.refreshToken});
            try {
                const result = await axiosInstance.post("/token", data);
                request.headers.Authorization = `Bearer ${result.data}`;
                const response = await axiosInstance(request);
                replaceToken(result.data);
                return response;
            } catch (error: unknown) {
                console.error(error);
            }
        }
        return Promise.reject(error);
    }

    return {onRequest, onResponseError};
}
