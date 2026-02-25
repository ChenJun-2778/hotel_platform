/** * 1. 定义后端统一返回的数据结构 
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

/** * 2. 定义具体的用户信息结构 (对应后端返回的 data.userInfo)
 */
export interface UserInfo {
  id: number;
  account: string;
  username: string;
  phone: string;
  email: string;
  role_type: number;
  avatar?: string | null; // 后端有这个字段，加上更好
  status?: number;
}

/** * 🌟 3. 新增：专门定义登录成功后，后端返回的完整的 data 结构
 */
export interface LoginResponse {
  token: string;
  userInfo: UserInfo;
}

/** * 4. 定义登录请求的入参参数
 */
export interface LoginParams {
  login_type: 'phone' | 'account';
  phone?: string;
  code?: string;
  account?: string;
  password?: string;
}

/** * 5. 定义注册请求的入参参数
 */
export interface RegisterParams {
  username: string;
  phone: string;
  password: string;
}