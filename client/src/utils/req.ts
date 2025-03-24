/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type InternalAxiosRequestConfig,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from 'axios';

interface IRes<T> {
  code: number;
  msg: string;
  data: T;
}

export class Req {
  private axiosIns: AxiosInstance;
  private defaultConfig: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 6000,
  };
  private constructor(config_: AxiosRequestConfig = {}) {
    const config = { ...this.defaultConfig, ...config_ };
    this.axiosIns = axios.create(config);

    this.axiosIns.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    }, Promise.reject /** (err: AxiosError) => Promise.reject(err) */);

    this.axiosIns.interceptors.response.use(
      (res: AxiosResponse) => {
        return res;
      },
      (err_: AxiosError) => {
        const err = err_.response?.data;
        return Promise.reject(err);
      },
    );
  }

  // todo: fix eslint error
  public request(config: AxiosRequestConfig): Promise<any> {
    return this.axiosIns.request(config);
  }

  public get<TResData = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<IRes<TResData>>> {
    return this.axiosIns.get(url, config);
  }

  public post<TReqData = any, TResData = any>(
    url: string,
    data?: TReqData,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<IRes<TResData>>> {
    return this.axiosIns.post(url, data, config);
  }

  public put<TReqData = any, TResData = any>(
    url: string,
    data?: TReqData,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<IRes<TResData>>> {
    return this.axiosIns.put(url, data, config);
  }

  public delete<TResDaa = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<IRes<TResDaa>>> {
    return this.axiosIns.delete(url, config);
  }

  private getToken(): string | null {
    //! React Hooks must be called in a React function component or a custom React Hook function
    // const token = useTokenStore();
    return sessionStorage.getItem('token');
  }

  // design pattern --> creational --> singleton
  static #req: Req;
  public static get request(): Req {
    if (!Req.#req) {
      Req.#req = new Req();
    }
    return Req.#req;
  }
}

export default Req.request
