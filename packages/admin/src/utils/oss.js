import OSS from 'ali-oss';
import { ossConfig, ossHost } from '../config/oss';

/**
 * 创建 OSS 客户端
 */
const createOssClient = () => {
  return new OSS({
    region: ossConfig.region,
    accessKeyId: ossConfig.accessKeyId,
    accessKeySecret: ossConfig.accessKeySecret,
    bucket: ossConfig.bucket,
    secure: true, // 强制使用 HTTPS
  });
};

/**
 * 生成唯一文件名
 * @param {string} originalName - 原始文件名
 * @param {string} folder - 文件夹路径，如 'hotels' 或 'rooms'
 * @returns {string} 新的文件名
 */
const generateFileName = (originalName, folder = 'uploads') => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = originalName.substring(originalName.lastIndexOf('.'));
  return `${folder}/${timestamp}-${randomStr}${ext}`;
};

/**
 * 上传文件到 OSS
 * @param {File} file - 要上传的文件
 * @param {string} folder - 存储文件夹，如 'hotels' 或 'rooms'
 * @param {Function} onProgress - 上传进度回调
 * @returns {Promise<string>} 返回文件的 URL
 */
export const uploadToOss = async (file, folder = 'uploads', onProgress) => {
  try {
    const client = createOssClient();
    const fileName = generateFileName(file.name, folder);
    
    // 上传文件，设置为公共读
    const result = await client.put(fileName, file, {
      headers: {
        'x-oss-object-acl': 'public-read', // 设置文件为公共读
      },
      progress: (p) => {
        if (onProgress) {
          onProgress(p);
        }
      },
    });

    // 返回文件的完整 URL
    return result.url || `${ossHost}/${fileName}`;
  } catch (error) {
    console.error('OSS 上传失败:', error);
    throw error;
  }
};

/**
 * 删除 OSS 文件
 * @param {string} url - 文件的 URL
 * @returns {Promise<void>}
 */
export const deleteFromOss = async (url) => {
  try {
    const client = createOssClient();
    // 从 URL 中提取文件名
    const fileName = url.replace(ossHost + '/', '');
    await client.delete(fileName);
  } catch (error) {
    console.error('OSS 删除失败:', error);
    throw error;
  }
};

/**
 * 批量上传文件
 * @param {File[]} files - 文件数组
 * @param {string} folder - 存储文件夹
 * @param {Function} onProgress - 上传进度回调
 * @returns {Promise<string[]>} 返回所有文件的 URL 数组
 */
export const uploadMultipleToOss = async (files, folder = 'uploads', onProgress) => {
  const uploadPromises = files.map((file, index) => {
    return uploadToOss(file, folder, (p) => {
      if (onProgress) {
        onProgress(index, p);
      }
    });
  });

  return Promise.all(uploadPromises);
};

/**
 * 验证文件类型
 * @param {File} file - 文件对象
 * @param {string[]} allowedTypes - 允许的文件类型
 * @returns {boolean}
 */
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']) => {
  return allowedTypes.includes(file.type);
};

/**
 * 验证文件大小
 * @param {File} file - 文件对象
 * @param {number} maxSize - 最大文件大小（MB）
 * @returns {boolean}
 */
export const validateFileSize = (file, maxSize = 5) => {
  const fileSizeMB = file.size / 1024 / 1024;
  return fileSizeMB <= maxSize;
};
