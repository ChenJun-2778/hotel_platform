/**
 * 表单验证规则 - 统一管理，便于复用
 */

/**
 * 用户名验证规则
 */
export const usernameRules = [
  { required: true, message: '请输入用户名' },
  { 
    pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/, 
    message: '用户名为2-20位字母、数字、下划线或中文' 
  }
];

/**
 * 邮箱验证规则
 */
export const emailRules = [
  { required: true, message: '请输入邮箱' },
  { type: 'email', message: '请输入有效的邮箱地址' },
  { max: 255, message: '邮箱地址不能超过255个字符' }
];

/**
 * 邮箱验证规则（可选）
 */
export const emailOptionalRules = [
  { type: 'email', message: '请输入有效的邮箱地址' },
  { max: 255, message: '邮箱地址不能超过255个字符' }
];

/**
 * 手机号验证规则
 */
export const phoneRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
];

/**
 * 手机号验证规则（可选）
 */
export const phoneOptionalRules = [
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
];

/**
 * 密码验证规则（注册/修改密码用）
 */
export const passwordRules = [
  { required: true, message: '请输入密码' },
  { 
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,20}$/, 
    message: '密码必须8-20位，包含大小写字母和数字' 
  }
];

/**
 * 密码验证规则（登录用，不限制格式）
 */
export const passwordLoginRules = [
  { required: true, message: '请输入密码' }
];

/**
 * 新密码验证规则（修改密码用）
 */
export const newPasswordRules = [
  { required: true, message: '请输入新密码' },
  { 
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,20}$/, 
    message: '密码必须8-20位，包含大小写字母和数字' 
  }
];

/**
 * 确认密码验证规则
 * @param {string} passwordFieldName - 密码字段名称，默认为 'password'
 */
export const confirmPasswordRules = (passwordFieldName = 'password') => [
  { required: true, message: '请确认密码' },
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue(passwordFieldName) === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('两次输入的密码不一致'));
    },
  }),
];

/**
 * 验证码验证规则
 */
export const codeRules = [
  { required: true, message: '请输入验证码' },
  { pattern: /^\d{6}$/, message: '请输入6位验证码' }
];

/**
 * 角色类型验证规则
 */
export const roleRules = [
  { required: true, message: '请选择角色类型' }
];

/**
 * 账号验证规则（登录用，支持用户名/手机号/邮箱）
 */
export const accountRules = [
  { required: true, message: '请输入用户名/手机号/邮箱' }
];
