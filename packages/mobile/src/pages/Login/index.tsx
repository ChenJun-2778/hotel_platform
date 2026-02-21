import React, { useState, useEffect, useRef } from 'react';
import { NavBar, Form, Input, Button, Toast } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutline, LockOutline, EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import styles from './index.module.css';
import { apiLogin } from '@/api/User/index';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm(); // 引入 Form 实例，为了能单独获取手机号
  const [loading, setLoading] = useState(false);

  // UI 控制状态
  const [visible, setVisible] = useState(false); // 控制密码显示/隐藏
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

  // 点击登录按钮触发
  const location = useLocation();
  const onFinish = async (values: any) => {
    console.log(`提交的数据 (${loginType} 模式):`, values);

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
        <div className={styles.title}>这里是易酒店~</div>
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
              登录
            </Button>
          }
        >
          {/* ========== 动态渲染：手机验证码模式 ========== */}
          {loginType === 'phone' && (
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
          {loginType === 'account' && (
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

          {/* ========== 切换登录方式的文字按钮 ========== */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px 0' }}>
            <span
              style={{ color: '#666', fontSize: 13, cursor: 'pointer' }}
              onClick={() => {
                // 切换模式并清空表单，防止数据互相污染
                setLoginType(loginType === 'account' ? 'phone' : 'account');
                form.resetFields();
              }}
            >
              {loginType === 'account' ? '手机验证码登录' : '账号密码登录'}
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