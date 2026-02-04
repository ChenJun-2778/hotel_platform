import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>易宿酒店预订平台</h1>
        <h2>登录</h2>
        <div className="login-form">
          <p>登录表单 - 待实现业务逻辑</p>
          <div className="login-actions">
            <Link to="/register" className="register-link">还没有账号？去注册</Link>
            <Link to="/home" className="skip-link">跳过登录，直接进入</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
