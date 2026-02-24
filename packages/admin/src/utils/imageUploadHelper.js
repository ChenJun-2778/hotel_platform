import { message } from 'antd';
import { uploadToOss } from './oss';

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

  // 统计需要上传的新文件数量
  const newFilesCount = fileList.filter(file => file.originFileObj).length;
  const existingFilesCount = fileList.filter(file => file.url && !file.originFileObj).length;
  
  console.log(`📤 图片上传统计: 新文件=${newFilesCount}, 已有文件=${existingFilesCount}`);
  
  if (newFilesCount > 0) {
    message.loading({ content: `正在上传 ${newFilesCount} 张新图片...`, key: messageKey });
  }
  
  try {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      if (file.originFileObj) {
        // 新上传的文件，需要上传到 OSS
        console.log(`📤 上传新文件: ${file.name}`);
        const url = await uploadToOss(file.originFileObj, folder);
        images.push(url);
      } else if (file.url) {
        // 已有的图片 URL（编辑时），直接使用，不重新上传
        console.log(`✅ 复用已有图片: ${file.url}`);
        images.push(file.url);
      }
    }
    
    if (newFilesCount > 0) {
      message.success({ content: `${newFilesCount} 张新图片上传成功`, key: messageKey });
    }
    
    console.log(`✅ 图片处理完成: 共 ${images.length} 张图片`);
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
