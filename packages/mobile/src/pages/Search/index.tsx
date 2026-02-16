import React, { useState, useEffect } from 'react';
import { NavBar, SearchBar, Tag, Toast, Dialog } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DeleteOutline } from 'antd-mobile-icons';
import styles from './index.module.css'; // 样式你自己简单写一下

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 获取 URL 上的参数，搜索完跳回去要带上，不能丢了
  const city = searchParams.get('city') || '上海';
  const beginDate = searchParams.get('beginDate');
  const endDate = searchParams.get('endDate');
  const type = searchParams.get('type');

  const [keyword, setKeyword] = useState('');
  const [historyList, setHistoryList] = useState<string[]>([]);

  // 1. 初始化读取历史记录
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('SEARCH_HISTORY') || '[]');
    setHistoryList(history);
  }, []);

  // 2. 执行搜索逻辑
  const doSearch = (val: string) => {
    if (!val.trim()) {
      Toast.show('请输入搜索内容');
      return;
    }

    // A. 存历史记录 (去重 + 截取前10条)
    const newHistory = [val, ...historyList.filter(h => h !== val)].slice(0, 10);
    setHistoryList(newHistory);
    localStorage.setItem('SEARCH_HISTORY', JSON.stringify(newHistory));

    // B. 跳回 List 页面，并带上 keyword 参数
    // 注意：要把之前的 city, date, type 也带回去，否则筛选条件就丢了
    let targetUrl = `/list?keyword=${encodeURIComponent(val)}`;
    if (city) targetUrl += `&city=${city}`;
    if (beginDate) targetUrl += `&beginDate=${beginDate}`;
    if (endDate) targetUrl += `&endDate=${endDate}`;
    if (type) targetUrl += `&type=${type}`;

    navigate(targetUrl, { replace: true });
  };

  // 清空历史
  const clearHistory = () => {
    Dialog.confirm({
      content: '确定清空历史记录吗？',
      onConfirm: () => {
        setHistoryList([]);
        localStorage.removeItem('SEARCH_HISTORY');
      },
    });
  };

  return (
    <div style={{ height: '100vh', background: '#fff' }}>
      <NavBar onBack={() => navigate(-1)} backArrow={false}>
        <div style={{ paddingRight: 12 }}>
          <SearchBar
            placeholder="位置/品牌/酒店"
            value={keyword}
            onChange={setKeyword}
            onSearch={doSearch} // 键盘回车触发
            autoFocus
            showCancelButton
            onCancel={() => navigate(-1)}
          />
        </div>
      </NavBar>

      {/* 历史记录区域 */}
      {historyList.length > 0 && (
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontWeight: 'bold' }}>历史搜索</span>
            <DeleteOutline onClick={clearHistory} style={{ color: '#999' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {historyList.map(item => (
              <Tag 
                key={item} 
                fill='outline' 
                color='default'
                onClick={() => doSearch(item)} // 点击标签直接搜索
              >
                {item}
              </Tag>
            ))}
          </div>
        </div>
      )}
      
      {/* 热门推荐（静态假数据） */}
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 12 }}>热门推荐</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['外滩', '迪士尼', '全季', '亚朵', '南京路'].map(item => (
             <Tag key={item} color='primary' fill='outline' onClick={() => doSearch(item)}>
               {item}
             </Tag>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;