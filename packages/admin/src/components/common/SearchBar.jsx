import { useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

/**
 * 通用搜索栏组件
 * @param {string} placeholder - 搜索框占位符
 * @param {function} onSearch - 搜索回调函数
 * @param {boolean} loading - 加载状态
 * @param {string} defaultValue - 默认值
 * @param {string} size - 尺寸 large | middle | small
 */
const SearchBar = ({ 
  placeholder = '请输入搜索关键词',
  onSearch,
  loading = false,
  defaultValue = '',
  size = 'large',
}) => {
  const [searchValue, setSearchValue] = useState(defaultValue);

  const handleSearch = (value) => {
    if (onSearch) {
      onSearch(value?.trim() || searchValue.trim());
    }
  };

  return (
    <Search
      placeholder={placeholder}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onSearch={handleSearch}
      size={size}
      allowClear
      disabled={loading}
      style={{ 
        width: 320,
        borderRadius: 20,
      }}
      styles={{
        input: {
          borderRadius: 20,
        }
      }}
    />
  );
};

export default SearchBar;
