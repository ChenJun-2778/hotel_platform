import React, { useState, useEffect } from 'react';
import { NavBar, SearchBar, Tag, Toast, Dialog, DotLoading, Button } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DeleteOutline, RightOutline } from 'antd-mobile-icons';
import styles from './index.module.css';
import { apiGetHotelList } from '@/api/Hotel';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 获取 URL 上的参数
  const city = searchParams.get('city') || '上海';
  const beginDate = searchParams.get('beginDate');
  const endDate = searchParams.get('endDate');
  const type = searchParams.get('type') || '1';

  const [keyword, setKeyword] = useState('');
  const [historyList, setHistoryList] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 初始化读取历史记录
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('SEARCH_HISTORY') || '[]');
    setHistoryList(history);
  }, []);

  // 实时搜索：当用户输入关键词时，调用后端接口搜索
  useEffect(() => {
    const searchHotels = async () => {
      if (!keyword.trim()) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      setShowResults(true);

      try {
        const params: any = {
          city,
          beginDate: beginDate || undefined,
          endDate: endDate || undefined,
          type,
          keyword: keyword.trim()
        };

        const res = await apiGetHotelList(params);

        if (res && res.success) {
          setSearchResults(res.data.list || []);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('搜索失败:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    // 防抖：用户停止输入 300ms 后才搜索
    const timer = setTimeout(searchHotels, 300);
    return () => clearTimeout(timer);
  }, [keyword, city, beginDate, endDate, type]);

  // 点击搜索按钮，跳转到 List 页面
  const handleSearchClick = () => {
    if (!keyword.trim()) {
      Toast.show('请输入搜索内容');
      return;
    }

    // 保存到历史记录
    const newHistory = [keyword, ...historyList.filter(h => h !== keyword)].slice(0, 10);
    setHistoryList(newHistory);
    localStorage.setItem('SEARCH_HISTORY', JSON.stringify(newHistory));

    // 跳转到 List 页面，带上关键词
    let targetUrl = `/list?keyword=${encodeURIComponent(keyword.trim())}`;
    if (city) targetUrl += `&city=${city}`;
    if (beginDate) targetUrl += `&beginDate=${beginDate}`;
    if (endDate) targetUrl += `&endDate=${endDate}`;
    if (type) targetUrl += `&type=${type}`;

    navigate(targetUrl);
  };

  // 点击搜索结果，跳转到详情页
  const handleResultClick = (hotel: any) => {
    // 保存到历史记录
    const newHistory = [keyword, ...historyList.filter(h => h !== keyword)].slice(0, 10);
    setHistoryList(newHistory);
    localStorage.setItem('SEARCH_HISTORY', JSON.stringify(newHistory));

    // 跳转到详情页
    navigate(`/detail/${hotel.id}?beginDate=${beginDate || ''}&endDate=${endDate || ''}`);
  };

  // 点击历史记录标签
  const handleHistoryClick = (item: string) => {
    setKeyword(item);
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
    <div className={styles.container}>
      <NavBar onBack={() => navigate(-1)}>搜索酒店</NavBar>

      {/* 搜索框区域 */}
      <div className={styles.searchBarWrapper}>
        <SearchBar
          placeholder="位置/品牌/酒店名称"
          value={keyword}
          onChange={setKeyword}
          autoFocus
          className={styles.searchInput}
        />
        {keyword.trim() && (
          <Button color='primary' size='mini' shape='rounded' onClick={handleSearchClick}>
            搜索
          </Button>
        )}
      </div>

      {/* 搜索结果列表 */}
      {showResults && (
        <div className={styles.resultsContainer}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <DotLoading color='primary' /> 搜索中...
            </div>
          ) : searchResults.length > 0 ? (
            <div className={styles.resultsList}>
              {searchResults.map(hotel => (
                <div 
                  key={hotel.id} 
                  className={styles.resultItem}
                  onClick={() => handleResultClick(hotel)}
                >
                  <div className={styles.resultLeft}>
                    <img 
                      src={hotel.cover_image} 
                      alt={hotel.name}
                      className={styles.resultImage}
                    />
                  </div>
                  <div className={styles.resultMiddle}>
                    <div className={styles.resultName}>{hotel.name}</div>
                    <div className={styles.resultLocation}>{hotel.location}</div>
                    <div className={styles.resultTags}>
                      {'◆'.repeat(hotel.star_rating || 0)} {hotel.brand}
                    </div>
                  </div>
                  <div className={styles.resultRight}>
                    <div className={styles.resultPrice}>
                      <span className={styles.priceUnit}>¥</span>
                      <span className={styles.priceNum}>{parseInt(hotel.min_price)}</span>
                    </div>
                    <RightOutline fontSize={16} color='#999' />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyWrapper}>
              <div className={styles.emptyText}>未找到相关酒店</div>
              <div className={styles.emptyHint}>试试其他关键词吧</div>
            </div>
          )}
        </div>
      )}

      {/* 历史记录和热门推荐（只在没有搜索结果时显示） */}
      {!showResults && (
        <>
          {/* 历史记录区域 */}
          {historyList.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>历史搜索</span>
                <DeleteOutline onClick={clearHistory} className={styles.deleteIcon} />
              </div>
              <div className={styles.tagContainer}>
                {historyList.map(item => (
                  <Tag 
                    key={item} 
                    fill='outline' 
                    color='default'
                    onClick={() => handleHistoryClick(item)}
                  >
                    {item}
                  </Tag>
                ))}
              </div>
            </div>
          )}
          
          {/* 热门推荐 */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>热门推荐</div>
            <div className={styles.tagContainer}>
              {['外滩', '迪士尼', '全季', '亚朵', '南京路'].map(item => (
                 <Tag key={item} color='primary' fill='outline' onClick={() => handleHistoryClick(item)}>
                   {item}
                 </Tag>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;