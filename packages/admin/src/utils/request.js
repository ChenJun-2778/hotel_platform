import { message } from 'antd';

/**
 * 统一的请求方法
 * @param {string} url - 请求地址
 * @param {object} options - 请求配置
 * @returns {Promise} 返回响应数据
 */
const request = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // 尝试解析响应体
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('❌ 非 JSON 响应:', text);
      throw new Error(`服务器返回非 JSON 数据: ${response.status}`);
    }

    // 检查 HTTP 状态码
    if (!response.ok) {
      const errorMsg = data.message || data.error || `HTTP Error: ${response.status}`;
      console.error(`❌ ${config.method || 'REQUEST'} ${url}`);
      console.error('❌ 状态码:', response.status);
      console.error('❌ 响应数据:', JSON.stringify(data, null, 2));
      console.error('❌ 错误消息:', errorMsg);
      message.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    // 根据后端返回的数据结构处理
    // 假设后端返回格式：{ success: true, data: {...}, message: '...' }
    if (data.success === false) {
      console.error(`❌ ${config.method} ${url} - ${data.message}`);
      message.error(data.message || '请求失败');
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('❌ 请求错误:', error.message);
    
    // 如果是网络错误
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      message.error('网络连接失败，请检查网络');
    } else if (!error.message.includes('HTTP Error')) {
      // 只在不是 HTTP 错误时显示通用错误
      message.error(error.message || '网络请求失败');
    }
    
    throw error;
  }
};

/**
 * GET 请求
 */
export const get = (url, params) => {
  let requestUrl = url;
  
  if (params) {
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    requestUrl = `${url}?${queryString}`;
  }

  return request(requestUrl, {
    method: 'GET',
  });
};

/**
 * POST 请求
 */
export const post = (url, data) => {
  // 检查数据中是否有 undefined 值
  const cleanData = {};
  Object.keys(data).forEach(key => {
    if (data[key] === undefined) {
      console.warn(`⚠️ POST请求 - 字段 ${key} 为 undefined，已跳过`);
    } else {
      cleanData[key] = data[key];
    }
  });
  
  console.log('📤 POST请求 - URL:', url);
  console.log('📤 POST请求 - 清理后的数据:', JSON.stringify(cleanData, null, 2));
  
  return request(url, {
    method: 'POST',
    body: JSON.stringify(cleanData),
  });
};

/**
 * PUT 请求
 */
export const put = (url, data) => {
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE 请求
 */
export const del = (url, params) => {
  let requestUrl = url;
  
  if (params) {
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    requestUrl = `${url}?${queryString}`;
  }

  return request(requestUrl, {
    method: 'DELETE',
  });
};

export default request;
