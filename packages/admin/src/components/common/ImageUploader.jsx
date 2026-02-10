import React from 'react';
import { Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

/**
 * 图片上传组件（延迟上传版本）
 * 选择图片后只预览，不立即上传到OSS
 * @param {array} fileList - 文件列表
 * @param {function} onChange - 文件变化回调
 * @param {function} onRemove - 删除文件回调
 * @param {number} maxCount - 最大上传数量
 * @param {string} uploadText - 上传按钮文字
 */
const ImageUploader = ({ 
  fileList = [],
  onChange,
  onRemove,
  maxCount = 1,
  uploadText = '上传图片'
}) => {
  // 自定义上传：阻止默认上传，只做本地预览
  const customRequest = ({ file, onSuccess }) => {
    // 创建本地预览URL
    const reader = new FileReader();
    reader.onload = (e) => {
      // 立即返回成功，但不上传到OSS
      // 将原始文件对象保存，供后续真正上传使用
      onSuccess({
        url: e.target.result, // 本地预览URL
        originFile: file, // 保存原始文件
      }, file);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = ({ fileList: newFileList }) => {
    // 处理文件列表，确保每个文件都有必要的信息
    const processedFileList = newFileList.map(file => {
      if (file.response) {
        return {
          ...file,
          url: file.response.url, // 本地预览URL
          originFileObj: file.response.originFile || file.originFileObj, // 原始文件对象
        };
      }
      return file;
    });
    
    onChange({ fileList: processedFileList });
  };

  const beforeUpload = (file) => {
    // 验证文件类型
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      return Upload.LIST_IGNORE;
    }

    // 验证文件大小（5MB）
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  return (
    <Upload
      listType="picture-card"
      maxCount={maxCount}
      multiple={maxCount > 1}
      fileList={fileList}
      customRequest={customRequest}
      onChange={handleChange}
      onRemove={onRemove}
      beforeUpload={beforeUpload}
      accept="image/*"
    >
      {fileList.length < maxCount && (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>{uploadText}</div>
        </div>
      )}
    </Upload>
  );
};

export default ImageUploader;
