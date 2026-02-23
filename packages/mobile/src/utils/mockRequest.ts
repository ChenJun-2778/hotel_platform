// src/utils/mockRequest.ts

/**
 * 模拟网络请求通用工具
 * @param data 要返回的数据
 * @param delay 延迟时间（毫秒），默认 500ms
 */
export const mockRequest = <T>(data: T, delay = 500): Promise<{ success: boolean; message: string; data: T }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: '查询成功',
          data: data,
        });
      }, delay);
    });
  };