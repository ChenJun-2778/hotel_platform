import React, { useState } from 'react';
import { NavBar, Form, Input, Button, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { UserOutline, LockOutline, EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import styles from './index.module.css';
// 假设这是你之后要换成的真实 API
// import { apiLogin } from '@/api/user';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false); // 控制密码显示/隐藏

  // 点击登录按钮触发
  const onFinish = async (values: any) => {
    console.log('提交的数据:', values);
    
    // 1. 简单的表单校验
    if (!values.username || !values.password) {
      Toast.show('请输入账号和密码');
      return;
    }

    setLoading(true);

    try {
      // -----------------------------------------------------------
      // 👇 真实开发时，这里替换成 await apiLogin(values.username, values.password)
      // -----------------------------------------------------------
      
      // 【模拟请求】为了演示效果，我们假装请求了 1 秒钟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 假设这是后端返回的数据
      const mockResponse = {
        code: 200,
        data: {
          token: 'mock_token_123456', // 模拟 Token
          userInfo: {
            id: 1001,
            nickname: '张三', // 正好对应你 PC 端后台那个“张三”
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            mobile: values.username
          }
        }
      };

      // -----------------------------------------------------------

      if (mockResponse.code === 200) {
        Toast.show({
            content: '登录成功',
            icon: 'success'
        });

        // ✅ 关键步骤：把 Token 存起来！
        localStorage.setItem('TOKEN', mockResponse.data.token);
        localStorage.setItem('USER_INFO', JSON.stringify(mockResponse.data.userInfo));

        // 登录成功后，返回上一页（或者跳去首页）
        // replace: true 表示登录页不留历史记录，防止用户点返回键又回到登录页
        navigate(-1); 
      } else {
        Toast.show('账号或密码错误');
      }

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
        {/* <div className={styles.subTitle}>未注册手机号验证后自动创建账号</div> */}
      </div>

      {/* 表单区域 */}
      <div className={styles.formSection}>
        <Form 
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
          <Form.Item
            name='username'
            label={<UserOutline />}
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input placeholder='请输入账号/手机号' clearable />
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