import request from "@/utils/request";
import type { LoginParams, ApiResponse, UserInfo } from './type';
/**
 * 移动端：用户登录接口
 * @param data 登录参数 (LoginParams)
 * @returns 返回一个 Promise，最终解析为包含 UserInfo 的 ApiResponse
 */
export const apiLogin = (data: LoginParams) => {
  return request.post<any, ApiResponse<UserInfo>>('/api/loginMobile/login', data);
};