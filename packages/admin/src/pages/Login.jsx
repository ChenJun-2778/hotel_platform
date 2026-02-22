import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Tabs, message, Select, Alert } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { login, register, sendCode, phoneLogin } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import {
  accountRules,
  passwordLoginRules,
  phoneRules,
  codeRules,
  usernameRules,
  emailRules,
  passwordRules,
  confirmPasswordRules,
  roleRules
} from '../utils/formValidation';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [showRegister, setShowRegister] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [accountForm] = Form.useForm();
  const [phoneForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  
  // 从路由状态中获取提示信息
  const stateMessage = location.state?.message;

  // 显示路由传递的提示信息
  useEffect(() => {
    if (stateMessage) {
      message.warning(stateMessage, 3);
      // 清除状态，避免刷新后重复显示
      window.history.replaceState({}, document.title);
    }
  }, [stateMessage]);

  // 账号登录
  const handleAccountLogin = async (values) => {
    try {
      setLoading(true);
      console.log('✅ 表单数据:', values);
      console.log('✅ 准备发送的登录数据:', {
        account: values.username,
        password: values.password,
      });
      
      const response = await login({
        account: values.username,
        password: values.password,
      });
      
      console.log('✅ 登录响应完整数据:', JSON.stringify(response, null, 2));
      
      // 保存用户信息和 token
      const userData = response.data || response;
      console.log('✅ 提取的用户数据:', JSON.stringify(userData, null, 2));
      console.log('✅ 用户ID:', userData.id);
      console.log('✅ 用户角色:', userData.role_type);
      
      authLogin(userData);
      
      message.success('登录成功！');
      
      // 根据角色跳转
      if (userData.role_type === 1 || userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/merchant/dashboard');
      }
    } catch (error) {
      console.error('❌ 登录失败:', error);
      console.error('❌ 错误详情:', error.message);
      message.error(error.message || '登录失败，请检查账号和密码');
    } finally {
      setLoading(false);
    }
  };

  // 验证码登录
  const handlePhoneLogin = async (values) => {
    try {
      setLoading(true);
      console.log('✅ 验证码登录:', values);
      
      const response = await phoneLogin({
        phone: values.phone,
        code: values.code,
      });
      
      console.log('✅ 登录响应:', response);
      
      // 保存用户信息和 token
      const userData = response.data || response;
      authLogin(userData);
      
      message.success('登录成功！');
      
      // 根据角色跳转
      if (userData.role_type === 1 || userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/merchant/dashboard');
      }
    } catch (error) {
      console.error('❌ 登录失败:', error);
      message.error(error.message || '登录失败，请检查手机号和验证码');
    } finally {
      setLoading(false);
    }
  };

  // 注册
  const handleRegister = async (values) => {
    try {
      setLoading(true);
      console.log('✅ 注册:', values);
      
      const response = await register({
        role_type: values.role === 'admin' ? 1 : 2,
        username: values.username,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      
      console.log('✅ 注册响应:', response);
      
      message.success('注册成功！请登录');
      
      // 切换到登录页面
      setShowRegister(false);
      registerForm.resetFields();
      
      // 自动填充用户名到登录表单
      accountForm.setFieldsValue({
        username: values.username,
      });
      setActiveTab('account');
    } catch (error) {
      console.error('❌ 注册失败:', error);
      message.error(error.message || '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 发送验证码
  const handleSendCode = async () => {
    try {
      const phone = phoneForm.getFieldValue('phone');
      await phoneForm.validateFields(['phone']);
      
      console.log('✅ 发送验证码到:', phone);
      
      await sendCode(phone);
      
      message.success('验证码已发送！');
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('❌ 发送验证码失败:', error);
      message.error(error.message || '发送验证码失败，请重试');
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setShowRegister(false);
  };

  const tabItems = [
    {
      key: 'account',
      label: '账号登录',
    },
    {
      key: 'phone',
      label: '验证码登录',
    },
  ];

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="brand-info">
          <div className="logo">
            <span className="logo-icon">易宿</span>
            <span className="logo-text">易宿酒店预订平台</span>
          </div>
          <h1 className="slogan">智慧酒店管理系统</h1>
          <p className="description">
            为酒店提供全方位的管理解决方案，包括订单管理、客房管理、
            会员管理、数据分析等功能，助力酒店数字化转型
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-container">
          {!showRegister ? (
            <>
              {/* 显示提示信息 */}
              {stateMessage && (
                <Alert
                  message={stateMessage}
                  type="warning"
                  showIcon
                  closable
                  style={{ marginBottom: 16 }}
                />
              )}
              
              <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={tabItems}
                className="auth-tabs"
              />

              {/* 账号登录表单 */}
              {activeTab === 'account' && (
                <Form
                  form={accountForm}
                  onFinish={handleAccountLogin}
                  autoComplete="off"
                  size="large"
                >
                  <Form.Item
                    name="username"
                    rules={accountRules}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="输入用户名/手机号/邮箱" 
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={passwordLoginRules}
                  >
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />} 
                      placeholder="输入密码" 
                    />
                  </Form.Item>

                  <Form.Item>
                    <div className="form-footer">
                      <a href="#" className="forgot-link">忘记账号/密码</a>
                    </div>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                      登录
                    </Button>
                  </Form.Item>

                  <div className="register-tip">
                    还没有账号？
                    <Button type="link" onClick={() => setShowRegister(true)} className="register-link">
                      点击注册
                    </Button>
                  </div>
                </Form>
              )}

              {/* 验证码登录表单 */}
              {activeTab === 'phone' && (
                <Form
                  form={phoneForm}
                  onFinish={handlePhoneLogin}
                  autoComplete="off"
                  size="large"
                >
                  <Form.Item
                    name="phone"
                    rules={phoneRules}
                  >
                    <Input 
                      prefix={<MobileOutlined />}
                      addonBefore="+86"
                      placeholder="输入手机号" 
                    />
                  </Form.Item>

                  <Form.Item
                    name="code"
                    rules={codeRules}
                  >
                    <Input 
                      placeholder="输入验证码" 
                      maxLength={6}
                      suffix={
                        <a 
                          onClick={handleSendCode}
                          className={countdown > 0 ? 'send-code-link disabled' : 'send-code-link'}
                        >
                          {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                        </a>
                      }
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                      登录
                    </Button>
                  </Form.Item>

                  <div className="register-tip">
                    还没有账号？
                    <Button type="link" onClick={() => setShowRegister(true)} className="register-link">
                      点击注册
                    </Button>
                  </div>
                </Form>
              )}
            </>
          ) : (
            <>
              <div className="register-header">
                <h2>创建新账号</h2>
                <Button type="link" onClick={() => setShowRegister(false)} className="back-button">
                  返回登录
                </Button>
              </div>

              <Form
                form={registerForm}
                onFinish={handleRegister}
                autoComplete="off"
                size="large"
                layout="vertical"
              >
                <Form.Item
                  label="角色类型"
                  name="role"
                  rules={roleRules}
                >
                  <Select
                    placeholder="选择您的角色"
                    suffixIcon={<TeamOutlined />}
                    options={[
                      { value: 'admin', label: '管理员' },
                      { value: 'merchant', label: '商户' }
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="用户名"
                  name="username"
                  rules={usernameRules}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="输入用户名" 
                  />
                </Form.Item>

                <Form.Item
                  label="邮箱"
                  name="email"
                  rules={emailRules}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="输入邮箱"
                  />
                </Form.Item>

                <Form.Item
                  label="手机号"
                  name="phone"
                  rules={phoneRules}
                >
                  <Input 
                    prefix={<MobileOutlined />}
                    addonBefore="+86"
                    placeholder="输入手机号" 
                  />
                </Form.Item>

                <Form.Item
                  label="密码"
                  name="password"
                  rules={passwordRules}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="输入密码" 
                  />
                </Form.Item>

                <Form.Item
                  label="确认密码"
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={confirmPasswordRules('password')}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="再次输入密码" 
                  />
                </Form.Item>

                <Form.Item style={{ marginTop: '24px', marginBottom: '0' }}>
                  <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                    立即注册
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
