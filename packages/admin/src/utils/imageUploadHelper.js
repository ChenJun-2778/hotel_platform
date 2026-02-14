import { message } from 'antd';

/**
 * 上传图片列表到 OSS
 * @param {Array} fileList - 文件列表
 * @param {string} folder - OSS 文件夹名称
 * @param {string} messageKey - 消息提示的 key
 * @returns {Promise<Array>} 返回图片 URL 数组
 */
export const uploadImagesToOss = async (fileList, folder = 'images', messageKey = 'uploadImages') => {
  const images = [];
  
  if (fileList.length === 0) {
    return images;
  }

  message.loading({ content: '正在上传图片...', key: messageKey });
  
  try {
    const { uploadToOss } = await import('./oss');
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      if (file.originFileObj) {
        // 新上传的文件，需要上传到 OSS
        const url = await uploadToOss(file.originFileObj, folder);
        images.push(url);
      } else if (file.url) {
        // 已有的图片 URL（编辑时）
        images.push(file.url);
      }
    }
    
    message.success({ content: '图片上传成功', key: messageKey });
    return images;
  } catch (error) {
    message.error({ content: '图片上传失败', key: messageKey });
    throw error;
  }
};

/**
 * 将图片 URL 数组转换为文件列表格式（用于编辑时回显）
 * @param {Array} imageUrls - 图片 URL 数组
 * @returns {Array} 文件列表
 */
export const convertUrlsToFileList = (imageUrls) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return [];
  }

  return imageUrls.map((url, index) => ({
    uid: `-${index + 1}`,
    name: `image-${index + 1}.jpg`,
    status: 'done',
    url: url,
  }));
};
