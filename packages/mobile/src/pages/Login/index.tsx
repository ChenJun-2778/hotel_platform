import React, { useState, useEffect, useRef } from 'react';
import { NavBar, Form, Input, Button, Toast } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutline, LockOutline, EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import styles from './index.module.css';
import { apiLogin, apiRegister } from '@/api/User/index';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm(); // 引入 Form 实例，为了能单独获取手机号
  const [loading, setLoading] = useState(false);

  // UI 控制状态
  const [visible, setVisible] = useState(false); // 控制密码显示/隐藏
  const [mode, setMode] = useState<'login' | 'register'>('login'); // 登录/注册模式
  const [loginType, setLoginType] = useState<'account' | 'phone'>('phone'); // 默认显示手机号登录

  // 验证码倒计时状态
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<any>(null);

  // 组件卸载时清除定时器，防止内存泄漏
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // 发送验证码逻辑
  const handleSendCode = () => {
    // 单独获取填写的手机号
    const phone = form.getFieldValue('phone');
    if (!phone) {
      Toast.show('请先输入手机号');
      return;
    }

    // 模拟发送动作
    Toast.show({ icon: 'success', content: '验证码已发送' });
    setCountdown(60);

    // 开启 60s 倒计时
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 点击登录/注册按钮触发
  const location = useLocation();
  const onFinish = async (values: any) => {
    console.log(`提交的数据 (${mode === 'register' ? '注册' : loginType} 模式):`, values);

    // 注册模式
    if (mode === 'register') {
      if (!values.username || !values.phone || !values.password) {
        Toast.show('请填写完整信息');
        return;
      }

      setLoading(true);
      try {
        const res = await apiRegister({
          username: values.username,
          phone: values.phone,
          password: values.password
        });

        Toast.show({ content: '注册成功，请登录', icon: 'success' });
        // 注册成功后切换到登录模式
        setMode('login');
        form.resetFields();
      } catch (error) {
        Toast.show('注册失败');
      } finally {
        setLoading(false);
      }
      return;
    }

    // 登录模式
    // 1. 简单的表单校验 (根据当前模式判断)
    if (loginType === 'account' && (!values.username || !values.password)) {
      Toast.show('请输入账号和密码');
      return;
    }
    if (loginType === 'phone' && (!values.phone || !values.code)) {
      Toast.show('请输入手机号和验证码');
      return;
    }

    setLoading(true);

    try {
      // 2. 根据不同的登录模式，动态构造传给后端的 payload
      const payload = loginType === 'phone'
        ? {
          login_type: 'phone',
          phone: values.phone,
          code: values.code
        }
        : {
          login_type: 'account',
          account: values.username, // 账号密码模式下，用 account 字段
          password: values.password
        };

      // 3. 发送真实网络请求
      const res = await apiLogin(payload as any);

      // 4. 成功后的处理逻辑
      // 因为我们在 request.ts 拦截器里拦截了非 success 的情况，
      // 所以代码能走到这里，说明必定是 HTTP 200 且 success: true。
      Toast.show({ content: '登录成功', icon: 'success' });

      // ✅ 严格按照你后端返回的格式，分别存入 Token 和 UserInfo
      localStorage.setItem('TOKEN', res.data.token);
      localStorage.setItem('USER_INFO', JSON.stringify(res.data.userInfo));

      // 5. 跳转回之前的页面，或者首页
      // 返回当前页

      const targetPath = location.state?.from || '/';
      navigate(targetPath, { replace: true });
    } catch (error) {
      Toast.show('网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 顶部导航，点击返回 */}
      <NavBar onBack={() => navigate(-1)} style={{ background: '#fff' }}></NavBar>

      {/* Logo 区域 */}
      <div className={styles.logoSection}>
        <div className={styles.logo}>易</div>
        <div className={styles.title}>{mode === 'register' ? '欢迎注册易酒店' : '这里是易酒店~'}</div>
      </div>

      {/* 表单区域 */}
      <div className={styles.formSection}>
        <Form
          form={form} // 绑定 form 实例
          layout='horizontal'
          onFinish={onFinish}
          footer={
            <Button
              block
              type='submit'
              color='primary'
              size='large'
              loading={loading}
              className={styles.submitBtn}
            >
              {mode === 'register' ? '注册' : '登录'}
            </Button>
          }
        >
          {/* ========== 注册模式 ========== */}
          {mode === 'register' && (
            <>
              <Form.Item
                name='username'
                label={<UserOutline />}
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder='请输入真实姓名' clearable />
              </Form.Item>

              <Form.Item
                name='phone'
                label={<UserOutline />}
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                ]}
              >
                <Input placeholder='请输入手机号' clearable type='tel' maxLength={11} />
              </Form.Item>

              <Form.Item
                name='password'
                label={<LockOutline />}
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6位' }
                ]}
                extra={
                  <div className={styles.eyeIcon} onClick={() => setVisible(!visible)}>
                    {visible ? <EyeOutline /> : <EyeInvisibleOutline />}
                  </div>
                }
              >
                <Input
                  placeholder='请输入密码（至少6位）'
                  type={visible ? 'text' : 'password'}
                  clearable
                />
              </Form.Item>
            </>
          )}

          {/* ========== 登录模式：手机验证码 ========== */}
          {mode === 'login' && loginType === 'phone' && (
            <>
              <Form.Item
                name='phone'
                label={<UserOutline />}
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input placeholder='请输入手机号' clearable />
              </Form.Item>

              <Form.Item
                name='code'
                label={<LockOutline />}
                rules={[{ required: true, message: '请输入验证码' }]}
                extra={
                  // 验证码获取按钮区域
                  <div
                    onClick={countdown === 0 ? handleSendCode : undefined}
                    style={{
                      color: countdown === 0 ? '#1677ff' : '#999',
                      fontSize: 14,
                      paddingLeft: 12,
                      borderLeft: '1px solid #eee',
                      cursor: countdown === 0 ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {countdown === 0 ? '获取验证码' : `${countdown}s 后重发`}
                  </div>
                }
              >
                <Input placeholder='请输入验证码' clearable />
              </Form.Item>
            </>
          )}

          {/* ========== 动态渲染：账号密码模式 ========== */}
          {mode === 'login' && loginType === 'account' && (
            <>
              <Form.Item
                name='username'
                label={<UserOutline />}
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input placeholder='请输入账号' clearable />
              </Form.Item>

              <Form.Item
                name='password'
                label={<LockOutline />}
                rules={[{ required: true, message: '请输入密码' }]}
                extra={
                  <div className={styles.eyeIcon} onClick={() => setVisible(!visible)}>
                    {visible ? <EyeOutline /> : <EyeInvisibleOutline />}
                  </div>
                }
              >
                <Input
                  placeholder='请输入密码'
                  type={visible ? 'text' : 'password'}
                  clearable
                />
              </Form.Item>
            </>
          )}

          {/* ========== 切换登录方式/注册的文字按钮 ========== */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px 0' }}>
            {mode === 'login' && (
              <span
                style={{ color: '#666', fontSize: 13, cursor: 'pointer' }}
                onClick={() => {
                  // 切换登录模式并清空表单
                  setLoginType(loginType === 'account' ? 'phone' : 'account');
                  form.resetFields();
                }}
              >
                {loginType === 'account' ? '手机验证码登录' : '账号密码登录'}
              </span>
            )}
            {mode === 'login' && <div style={{ flex: 1 }}></div>}
            <span
              style={{ color: '#1677ff', fontSize: 13, cursor: 'pointer' }}
              onClick={() => {
                // 切换登录/注册模式并清空表单
                setMode(mode === 'login' ? 'register' : 'login');
                form.resetFields();
                setVisible(false);
              }}
            >
              {mode === 'login' ? '立即注册' : '已有账号？去登录'}
            </span>
          </div>
        </Form>
      </div>

      {/* 底部协议（装饰用） */}
      <div className={styles.footer}>
        登录即代表同意
        <span className={styles.link}>《用户协议》</span>
        和
        <span className={styles.link}>《隐私政策》</span>
      </div>
    </div>
  );
};

export default Login;