import request from "@/utils/request";
import type { LoginParams, ApiResponse, UserInfo } from './type';
/**
 * 移动端：用户登录接口
 * @param data 登录参数 (LoginParams)
 * @returns 返回一个 Promise，最终解析为包含 UserInfo 的 ApiResponse
 */
export const apiLogin = (data: LoginParams) => {
    // request.post<参数1, 参数2> 
    // 参数1: axios 内部使用的类型(一般写 any)
    // 参数2: 最终返回给页面的数据类型 (ApiResponse<UserInfo>)
    return request.post<any, ApiResponse<UserInfo>>('/api/loginMobile/login', data);
  };