import { useState } from 'react';
import { message } from 'antd';
import { uploadToOss, validateFileType, validateFileSize } from '../utils/oss';

/**
 * OSS 上传 Hook
 * @param {string} folder - 存储文件夹名称
 * @returns {object} 上传相关的状态和方法
 */
const useOssUpload = (folder = 'uploads') => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  /**
   * 自定义上传方法
   * @param {object} options - Ant Design Upload 组件的 options
   * @returns {Promise<string>} 返回上传后的 URL
   */
  const customUpload = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;

    // 验证文件类型
    if (!validateFileType(file)) {
      message.error('只支持 JPG、PNG、JPEG、WEBP 格式的图片！');
      onError(new Error('文件格式不支持'));
      return;
    }

    // 验证文件大小
    if (!validateFileSize(file, 5)) {
      message.error('图片大小不能超过 5MB！');
      onError(new Error('文件大小超限'));
      return;
    }

    setUploading(true);

    try {
      // 上传到 OSS
      const url = await uploadToOss(file, folder, (p) => {
        const percent = Math.floor(p * 100);
        setProgress(percent);
        if (onProgress) {
          onProgress({ percent });
        }
      });

      setUploading(false);
      setProgress(0);
      message.success('上传成功！');
      
      // 通知 Upload 组件上传成功
      if (onSuccess) {
        onSuccess({ url }, file);
      }

      return url;
    } catch (error) {
      setUploading(false);
      setProgress(0);
      message.error('上传失败，请重试！');
      console.error('上传失败:', error);
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  };

  return {
    uploading,
    progress,
    customUpload,
  };
};

export default useOssUpload;
