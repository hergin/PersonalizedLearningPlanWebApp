import axios, { AxiosError } from "axios";
import useAxiosInterceptorHandlers from "./useAxiosInterceptorHandlers";

export const useApiConnection = () => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const { onRequest, onResponseError } = useAxiosInterceptorHandlers(axiosInstance);

  axiosInstance.interceptors.request.use(onRequest, (error: AxiosError) => Promise.reject(error));
  axiosInstance.interceptors.response.use((response) => response, onResponseError);

  const get = async (path: string) => {
    const response = await axiosInstance.get(path);
    return response.data;
  };

  const post = async (path: string, data: object) => {
    const response = await axiosInstance.post(path, data);
    return response.data;
  };

  const put = async (path: string, data: object) => {
    const response = await axiosInstance.put(path, data);
    return response.data;
  };

  const del = async (path: string) => {
    const response = await axiosInstance.delete(path);
    return response.data;
  };

  return { get, post, put, del };
};
