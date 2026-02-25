import request from "@/utils/request";
import type { LoginParams, ApiResponse, UserInfo, RegisterParams, UpdateProfileParams } from './type';

export enum UserApi {
  LOGIN = '/api/loginMobile/login',
  REGISTER = '/api/loginMobile/register',
  UPDATE_PROFILE = '/api/loginMobile/profile', // 更新用户信息
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

/**
 * 移动端：更新用户信息接口
 * @param userId 用户ID
 * @param data 更新参数 (UpdateProfileParams)
 * @returns 返回一个 Promise，最终解析为包含更新后用户信息的 ApiResponse
 */
export const apiUpdateProfile = (userId: number, data: UpdateProfileParams) => {
  return request.put<any, ApiResponse<any>>(`${UserApi.UPDATE_PROFILE}/${userId}`, data);
};