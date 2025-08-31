import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

type UseFetch = <T = any>(
    url: string,
    config?: AxiosRequestConfig
) => Promise<AxiosResponse<T>>;

export default function useFetch(): UseFetch {
    const { getToken } = useAuth();

    const authenticatedFetch: UseFetch = async <T = any>(
        url: string,
        config: AxiosRequestConfig = {}
    ): Promise<AxiosResponse<T>> => {
        const token = await getToken();

        // Don't override Content-Type if uploading files
        const isFormData = config.data instanceof FormData;

        return axios({
            url,
            ...config,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
                ...(config.headers || {}),
            },
        });
    };

    return authenticatedFetch;
}
