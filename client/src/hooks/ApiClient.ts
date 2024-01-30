import axios from "axios";
import { useUser } from "./useUser";

export const ApiClient = () => {
  const { user, replaceToken } = useUser();
  const api = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      const token = user?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        user.refreshToken &&
        error.response &&
        error.response.status === 401
      ) {
        let data = JSON.stringify({ refreshToken: user.refreshToken });
        try {
          const result = await api.post("/token", data);
          originalRequest.headers.Authorization = `Bearer ${result.data}`;
          const response = api(originalRequest).then((response) => {
            return response;
          });
          replaceToken(result.data);
          return response;
        } catch (error) {
          console.error(error);
        }
      }
      return Promise.reject(error);
    },
  );

  const get = async (path : string) => {
    const response = await api.get(path);
    return response.data;
  };

  const post = async (path : string, data : object) => {
    const response = await api.post(path, data);
    console.log(response);
    return response.data;
  };

  const put = async (path : string, data : object) => {
    const response = await api.put(path, data);
    return response.data;
  };

  const del = async (path : string) => {
    return await api.delete(path);
  };

  return { get, post, put, del };
};
