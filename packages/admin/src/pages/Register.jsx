import React from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  return (
    <div className="register-page">
      <div className="register-container">
        <h1>易宿酒店预订平台</h1>
        <h2>注册</h2>
        <div className="register-form">
          <p>注册表单 - 待实现业务逻辑</p>
          <div className="register-actions">
            <Link to="/login" className="login-link">已有账号？去登录</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
