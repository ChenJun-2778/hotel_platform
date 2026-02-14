import React, { useState } from 'react';
import { Modal, Form } from 'antd';
import PageContainer from '../../../components/common/PageContainer';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import useUserList from './hooks/useUserList';

/**
 * 用户管理页面
 */
const Users = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  
  const { users, loading, searchUsers, addUser, updateUser, deleteUser } = useUserList();

  /**
   * 搜索用户
   */
  const handleSearch = (keyword) => {
    searchUsers(keyword);
  };

  /**
   * 打开添加用户弹窗
   */
  const showAddModal = () => {
    setIsAddModalOpen(true);
    form.resetFields();
  };

  /**
   * 关闭添加弹窗
   */
  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    form.resetFields();
  };

  /**
   * 提交添加用户
   */
  const handleAddSubmit = async (values) => {
    const success = await addUser(values);
    if (success) {
      handleAddCancel();
    }
  };

  /**
   * 编辑用户
   */
  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };

  /**
   * 关闭编辑弹窗
   */
  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setCurrentUser(null);
    form.resetFields();
  };

  /**
   * 提交编辑用户
   */
  const handleEditSubmit = async (values) => {
    const success = await updateUser(currentUser.key, values);
    if (success) {
      handleEditCancel();
    }
  };

  /**
   * 删除用户
   */
  const handleDelete = async (user) => {
    await deleteUser(user.key);
  };

  return (
    <PageContainer
      title="用户管理"
      showSearch={true}
      searchPlaceholder="搜索用户名、邮箱"
      onSearch={handleSearch}
      searchLoading={loading}
      showAddButton={true}
      onAdd={showAddModal}
    >
      <UserTable 
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 添加用户弹窗 */}
      <Modal
        title="添加用户"
        open={isAddModalOpen}
        onCancel={handleAddCancel}
        footer={null}
        width={600}
      >
        <UserForm
          form={form}
          onFinish={handleAddSubmit}
          onCancel={handleAddCancel}
        />
      </Modal>

      {/* 编辑用户弹窗 */}
      <Modal
        title="编辑用户"
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        footer={null}
        width={600}
      >
        <UserForm
          form={form}
          onFinish={handleEditSubmit}
          onCancel={handleEditCancel}
          isEdit={true}
        />
      </Modal>
    </PageContainer>
  );
};

export default Users;
