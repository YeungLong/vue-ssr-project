import axios from "axios";
import qs from "qs";
import {Message,Loading} from 'element-ui'

const Axios = axios.create({
    baseURL: "/",
    timeout: 10000,
    // responseType: "json",
    withCredentials: true, // 是否允许带cookie这些
    headers: {
        "Content-Type": "text/plain;charset=UTF-8"
    },
    // 请求URL中统一添加公共get参数数据
    params: {
        token: "",
    }
});

/**
 * 
 * 请求拦截器设置
 * 令牌统一拼接
 * 
 */
Axios.interceptors.request.use(
    config => {
        Loading.service({text:"Loading..."});
        // 弥补axios初始化获取不到sessionStorage问题
        config.params.token = "2a0ed494-9a74-4818-8540-b92bb87f06d8";
        console.log('Axios.interceptors.request.use-config:', config);
        return config;
    },
    error => {
        console.log('Axios.interceptors.request.use-error:', error);
        return Promise.reject(error);
    }
);

/**
 * 
 * 响应拦截器设置
 * 主要提前处理返回结果错误,以及网络请求状态错误
 * 
 */
Axios.interceptors.response.use(
    res => {
        Loading.service().close();
        console.log('Axios.interceptors.response.use-res:', res);
        // 判断API接口状态约定, 错误处理配置
        if (res.data && res.data.returncode && res.data.returncode != 0) {
            Message.error({
                //title: '错误提示',
                message: res.data.data
            });
            return Promise.reject(res.data);
        }
        return res.data;
    },
    error => {
        Loading.service().close();
        // console.log('Axios.interceptors.response.use-error:', error);
        // console.log('Axios.interceptors.response.use-errorresponse:', error.response);
        // 网络请求错误提示
        if (error && error.response) {
            let message = '';
            switch (error.response.status) {
                case 400:
                    message = `请求错误: ${error.response.config.url}400`;
                    break
                case 401:
                    message = `未授权，请登录: ${error.response.config.url}401`;
                    break
                case 403:
                    message = `拒绝访问: ${error.response.config.url}403`;
                    break
                case 404:
                    message = `请求地址出错: ${error.response.config.url}404`;
                    break
                case 408:
                    message = `请求超时: ${error.response.config.url}408`;
                    break
                case 500:
                    message = `服务器内部错误: ${error.response.config.url}500`;
                    break
                case 501:
                    message = `服务未实现: ${error.response.config.url}501`;
                    break
                case 502:
                    message = `网关错误: ${error.response.config.url}502`;
                    break
                case 503:
                    message = `服务不可用: ${error.response.config.url}503`;
                    break
                case 504:
                    message = `网关超时: ${error.response.config.url}504`;
                    break
                case 505:
                    message = `HTTP版本不受支持: ${error.response.config.url}505`;
                    break
                default:
            }
            // element信息提示
            Message.error({
                //title: '服务请求错误',
                message: message
            });
        }
        return error;
    }
);

/**
 * 
 * 请求整理
 * 
 */
const fetch = (options) => {
    const { method = 'get', data, url, } = options
    switch (method.toLowerCase()) {
        case 'get':
            return Axios.get(`${url}${options.data ? `?${qs.stringify(options.data)}` : ''}`)
        case 'delete':
            return Axios.delete(url, { data })
        case 'head':
            return Axios.head(url, data)
        case 'post':
            return Axios.post(url, data)
        case 'put':
            return Axios.put(url, data)
        case 'patch':
            return Axios.patch(url, data)
        default:
            return Axios(options)
    }
}

export default function request(options) {
    return fetch(options).catch((error) => {
        console.log("error:", error);
    });
}