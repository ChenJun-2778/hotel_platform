import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, message, Progress } from 'antd';
import { UserOutlined, ShopOutlined, FileTextOutlined, DollarOutlined, SafetyOutlined } from '@ant-design/icons';
import { getAdminDashboard } from '../../services/dashboardService';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalHotels: 0,
    pendingHotels: 0,
    totalIncome: 0,
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('📊 加载管理员控制台数据');
      const response = await getAdminDashboard();
      console.log('✅ 控制台数据:', response);
      
      const data = response.data || response;
      setDashboardData({
        totalUsers: data.totalUsers || 0,
        totalHotels: data.totalHotels || 0,
        pendingHotels: data.pendingHotels || 0,
        totalIncome: data.totalIncome || 0,
      });
    } catch (error) {
      console.error('❌ 加载控制台数据失败:', error);
      message.error('加载控制台数据失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const statsCards = [
    {
      title: '总用户数',
      value: dashboardData.totalUsers,
      icon: <UserOutlined />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea',
      suffix: '人',
    },
    {
      title: '酒店总数',
      value: dashboardData.totalHotels,
      icon: <ShopOutlined />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f5576c',
      suffix: '家',
    },
    {
      title: '待审核酒店',
      value: dashboardData.pendingHotels,
      icon: <FileTextOutlined />,
      gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      color: '#ff4d4f',
      suffix: '家',
      alert: dashboardData.pendingHotels > 0,
    },
    {
      title: '平台总收入',
      value: dashboardData.totalIncome,
      icon: <DollarOutlined />,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      color: '#faad14',
      suffix: '元',
      precision: 2,
    },
  ];

  return (
    <div style={{ 
      padding: '24px', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: 'calc(100vh - 64px)' 
    }}>
      {/* 页面标题 */}
      <div style={{ 
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{ 
            margin: 0,
            fontSize: 28, 
            fontWeight: 700, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            首页
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#8c8c8c', fontSize: 14 }}>
            平台运营数据总览
          </p>
        </div>
        <SafetyOutlined style={{ fontSize: 48, color: '#667eea', opacity: 0.3 }} />
      </div>
      
      <Spin spinning={loading}>
        {/* 统计卡片 */}
        <Row gutter={[24, 24]}>
          {statsCards.map((card, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                hoverable
                style={{ 
                  borderRadius: 16,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}
                styles={{
                  body: { padding: '24px' }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                }}
              >
                {/* 背景装饰 */}
                <div style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 120,
                  height: 120,
                  background: card.gradient,
                  borderRadius: '50%',
                  opacity: 0.1,
                }} />
                
                {/* 警告标记 */}
                {card.alert && (
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 8,
                    height: 8,
                    background: '#ff4d4f',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite',
                  }} />
                )}
                
                {/* 图标 */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: card.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  fontSize: 28,
                  color: '#fff',
                  boxShadow: `0 4px 12px ${card.color}40`,
                }}>
                  {card.icon}
                </div>
                
                {/* 标题 */}
                <div style={{ 
                  fontSize: 14, 
                  color: '#8c8c8c',
                  marginBottom: 8,
                  fontWeight: 500,
                }}>
                  {card.title}
                </div>
                
                {/* 数值 */}
                <div style={{ 
                  fontSize: 32, 
                  fontWeight: 700,
                  color: '#262626',
                  marginBottom: 4,
                }}>
                  {card.precision ? card.value.toFixed(card.precision) : card.value}
                  <span style={{ fontSize: 16, fontWeight: 400, marginLeft: 4, color: '#8c8c8c' }}>
                    {card.suffix}
                  </span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 欢迎卡片 */}
        <Card 
          style={{ 
            marginTop: '24px',
            borderRadius: 16,
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
          }}
          styles={{
            body: { padding: '32px' }
          }}
        >
          <Row gutter={24} align="middle">
            <Col xs={24} md={16}>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: '#fff' }}>
                🛡️ 欢迎使用管理后台
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, margin: 0, opacity: 0.9 }}>
                这里是管理员专属页面，您可以管理整个平台的运营。
                <br />
                监控平台数据，审核酒店信息，确保平台健康运行。
              </p>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <Progress 
                  type="circle" 
                  percent={dashboardData.pendingHotels > 0 ? 
                    Math.min((dashboardData.pendingHotels / dashboardData.totalHotels) * 100, 100) : 0}
                  strokeColor={{
                    '0%': '#fff',
                    '100%': '#ff4d4f',
                  }}
                  trailColor="rgba(255,255,255,0.2)"
                  format={() => (
                    <div style={{ color: '#fff' }}>
                      <div style={{ fontSize: 24, fontWeight: 700 }}>{dashboardData.pendingHotels}</div>
                      <div style={{ fontSize: 12 }}>待审核</div>
                    </div>
                  )}
                />
              </div>
            </Col>
          </Row>
        </Card>
      </Spin>

      {/* 添加脉冲动画 */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
