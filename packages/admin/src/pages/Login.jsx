import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, MailOutlined } from '@ant-design/icons';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [showRegister, setShowRegister] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [accountForm] = Form.useForm();
  const [phoneForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  // 账号登录
  const handleAccountLogin = (values) => {
    console.log('账号登录:', values);
    message.success('登录成功！');
    navigate('/home');
  };

  // 验证码登录
  const handlePhoneLogin = (values) => {
    console.log('验证码登录:', values);
    message.success('登录成功！');
    navigate('/home');
  };

  // 注册
  const handleRegister = (values) => {
    console.log('注册:', values);
    message.success('注册成功！');
    setShowRegister(false);
    setActiveTab('account');
    registerForm.resetFields();
  };

  // 发送验证码
  const handleSendCode = async () => {
    try {
      const phone = phoneForm.getFieldValue('phone');
      await phoneForm.validateFields(['phone']);
      
      console.log('发送验证码到:', phone);
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
      console.log('验证失败:', error);
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
                    rules={[
                      { required: true, message: '请输入用户名' },
                      { 
                        pattern: /^[a-zA-Z0-9_]{4,16}$/, 
                        message: '用户名必须是4-16位字母、数字或下划线' 
                      }
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="输入账号" 
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: '请输入密码' },
                      { 
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,20}$/, 
                        message: '密码必须8-20位，包含大小写字母和数字' 
                      }
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
                    <Button type="primary" htmlType="submit" block>
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
                    rules={[
                      { required: true, message: '请输入手机号' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                    ]}
                  >
                    <Input 
                      prefix={<MobileOutlined />}
                      addonBefore="+86"
                      placeholder="输入手机号" 
                    />
                  </Form.Item>

                  <Form.Item
                    name="code"
                    rules={[
                      { required: true, message: '请输入验证码' },
                      { pattern: /^\d{6}$/, message: '请输入6位验证码' }
                    ]}
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
                    <Button type="primary" htmlType="submit" block>
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
                <h2>注册新账号</h2>
                <Button type="link" onClick={() => setShowRegister(false)} className="back-button">
                  返回登录
                </Button>
              </div>

              <Form
                form={registerForm}
                onFinish={handleRegister}
                autoComplete="off"
                size="large"
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { 
                      pattern: /^[a-zA-Z0-9_]{4,16}$/, 
                      message: '用户名必须是4-16位字母、数字或下划线' 
                    }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="输入用户名" 
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="输入邮箱" 
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                  ]}
                >
                  <Input 
                    prefix={<MobileOutlined />}
                    addonBefore="+86"
                    placeholder="输入手机号" 
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { 
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,20}$/, 
                      message: '密码必须8-20位，包含大小写字母和数字' 
                    }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="输入密码" 
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请再次输入密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次密码输入不一致'));
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="再次输入密码" 
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    注册
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
