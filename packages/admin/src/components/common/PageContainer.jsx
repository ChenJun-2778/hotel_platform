import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SearchBar from './SearchBar';

/**
 * 通用页面容器组件
 * 提供统一的页面布局：标题、搜索栏、内容区、悬浮添加按钮
 * 
 * @param {string} title - 页面标题
 * @param {ReactNode} titleExtra - 标题右侧额外内容（如下拉选择器）
 * @param {boolean} showSearch - 是否显示搜索栏
 * @param {string} searchPlaceholder - 搜索框占位符
 * @param {function} onSearch - 搜索回调
 * @param {boolean} searchLoading - 搜索加载状态
 * @param {boolean} showAddButton - 是否显示悬浮添加按钮
 * @param {function} onAdd - 添加按钮点击回调
 * @param {ReactNode} children - 页面内容
 * @param {object} cardStyle - Card 自定义样式
 * @param {object} containerStyle - 容器自定义样式
 */
const PageContainer = ({
  title,
  titleExtra,
  showSearch = true,
  searchPlaceholder = '请输入搜索关键词',
  onSearch,
  searchLoading = false,
  showAddButton = true,
  onAdd,
  children,
  cardStyle = {},
  containerStyle = {},
}) => {
  return (
    <div 
      style={{ 
        padding: '24px', 
        background: '#f0f2f5', 
        minHeight: 'calc(100vh - 64px)', 
        position: 'relative',
        ...containerStyle,
      }}
    >
      <Card
        title={
          titleExtra ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{title}</span>
              {titleExtra}
            </div>
          ) : (
            <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>
          )
        }
        extra={
          showSearch && (
            <SearchBar
              placeholder={searchPlaceholder}
              onSearch={onSearch}
              loading={searchLoading}
            />
          )
        }
        style={{
          borderRadius: 12,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
          ...cardStyle,
        }}
      >
        {children}
      </Card>

      {/* 悬浮添加按钮 */}
      {showAddButton && onAdd && (
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined style={{ fontSize: 24 }} />}
          size="large"
          onClick={onAdd}
          style={{
            position: 'fixed',
            right: 48,
            bottom: 48,
            width: 64,
            height: 64,
            fontSize: 24,
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      )}
    </div>
  );
};

export default PageContainer;
