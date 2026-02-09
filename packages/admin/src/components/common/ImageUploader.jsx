import React from 'react';
import { Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useOssUpload from '../../hooks/useOssUpload';

/**
 * 图片上传组件
 * @param {array} fileList - 文件列表
 * @param {function} onChange - 文件变化回调
 * @param {function} onRemove - 删除文件回调
 * @param {number} maxCount - 最大上传数量
 * @param {string} folder - OSS 存储文件夹
 * @param {string} uploadText - 上传按钮文字
 */
const ImageUploader = ({ 
  fileList = [],
  onChange,
  onRemove,
  maxCount = 1,
  folder = 'uploads',
  uploadText = '上传图片'
}) => {
  const { customUpload } = useOssUpload(folder);

  return (
    <Upload
      listType="picture-card"
      maxCount={maxCount}
      multiple={maxCount > 1}
      fileList={fileList}
      customRequest={customUpload}
      onChange={onChange}
      onRemove={onRemove}
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
