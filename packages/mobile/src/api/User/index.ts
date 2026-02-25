import request from "@/utils/request";
import type { LoginParams, ApiResponse, UserInfo, RegisterParams } from './type';

export enum UserApi {
  LOGIN = '/api/loginMobile/login',
  REGISTER = '/api/loginMobile/register',
}
/**
 * 移动端：用户登录接口
 * @param data 登录参数 (LoginParams)
 * @returns 返回一个 Promise，最终解析为包含 UserInfo 的 ApiResponse
 */
export const apiLogin = (data: LoginParams) => {
  return request.post<any, ApiResponse<UserInfo>>(UserApi.LOGIN, data);
};

/**
 * 移动端：用户注册接口
 * @param data 注册参数 (RegisterParams)
 * @returns 返回一个 Promise，最终解析为包含用户信息的 ApiResponse
 */
export const apiRegister = (data: RegisterParams) => {
  return request.post<any, ApiResponse<any>>(UserApi.REGISTER, data);
};