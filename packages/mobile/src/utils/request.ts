import axios from "axios";
import { Toast } from "antd-mobile";

// 1. 创建 axios 实例
// console.log('👉 当前 Vite 运行模式:', import.meta.env.MODE);
// console.log('当前读取的基地址是:', import.meta.env.VITE_API_BASE_URL);
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 填入你的后端真实运行地址，或者使用 vite 的 proxy 代理
  timeout: 10000, // 超时时间 10 秒
});
// 2. 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 每次发送请求之前，从本地拿出 Token
    const token = localStorage.getItem('TOKEN');

    // 如果有 Token，就塞到请求头里带给后端 (Bearer 是标准的 JWT 格式，具体看你后端设计)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 3. 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 这里的 response 是 HTTP 层面请求成功的结果 (状态码 2xx)
    const res = response.data; // 这个 res 就是你截图里的 { success, message, data } 整个对象

    // 核心修改：统一拦截业务逻辑错误
    if (res.success === false) {
      // 只要后端返回了 success: false，我们就全局弹窗报错
      Toast.show({
        icon: 'fail',
        content: res.message || '操作失败'
      });

      // 并把这个错误抛出去，让页面里的 catch 能够捕获到，停止执行后续的成功逻辑
      return Promise.reject(new Error(res.message || '业务请求失败'));
    }

    // 业务逻辑成功 (success: true)，直接把整个剥离好的数据返回给页面
    return res;
  },
  (error) => {
    // 兜底：处理 HTTP 层面的报错 (比如 401未登录、500服务器崩溃、断网等)
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 清除失效的本地数据
          localStorage.removeItem('TOKEN');
          localStorage.removeItem('USER_INFO');
          // 可选：提示登录过期
          // Toast.show({ icon: 'fail', content: '登录已过期，请重新登录' });
          break;
        case 403:
          Toast.show({ icon: 'fail', content: data.message || '没有权限' });
          break;
        case 400:
          // 因为你在 Express 里写了 res.status(400).json({ success: false... })
          // 所以 400 错误会走到这里。我们统一读取后端的 message 并弹出
          Toast.show({ icon: 'fail', content: data.message || '请求参数错误' });
          break;
        case 500:
          Toast.show({ icon: 'fail', content: data.message || '服务器开小差了' });
          break;
        default:
          Toast.show({ icon: 'fail', content: data.message || '请求失败' });
      }
    } else {
      // 请求连后端都没到达（比如断网了）
      Toast.show({ icon: 'fail', content: '网络异常，请检查你的网络' });
    }

    return Promise.reject(error);
  }
);

export default request;