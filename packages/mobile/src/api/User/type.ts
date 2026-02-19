/** * 1. 定义后端统一返回的数据结构 
 * T 泛型代表 data 里面的具体内容，默认是 any
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
  }

/** * 2. 定义登录成功的用户信息结构 (根据你后端的返回)
 */
export interface UserInfo {
    id: number;
    account: string;
    username: string;
    phone: string;
    role_type: number;
  }

/** * 3. 定义登录请求的入参参数
 * 使用 ? 表示这个字段是可选的（因为手机号登录不需要密码，账号登录不需要验证码）
 */
export interface LoginParams {
    login_type: 'phone' | 'account'; // 必须是这两个值之一
    phone?: string;
    code?: string;
    account?: string;
    password?: string;
  }