import React from 'react';
import Profile from '../common/Profile';

/**
 * 商户端个人信息页面
 */
const MerchantProfile = () => {
  // 不传 userInfo，让 Profile 组件自动从后端获取真实数据
  return <Profile />;
};

export default MerchantProfile;
