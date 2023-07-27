import React, { memo } from 'react';
import { Button, Form, Input } from 'antd';

function SupplierForm(props) {
  const {
    isHiddenSubmit,

    formName,

    form,
    optionStyle,

    onFinish,
  } = props;

  return (
    <Form
      form={form}
      className=""
      name={formName}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={optionStyle}
      onFinish={onFinish}
    >
      <Form.Item
        label="Tên NCC"
        name="name"
        rules={[
          {
            required: true,
            message: 'Vui lòng điền tên',
          },
          {
            min: 2,
            message: 'Vui lòng nhập tên trên 10 ký tự',
          },
          { max: 50, message: 'Tối đa 50 ký tự' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[
          { min: 5, message: 'Tối thiểu 5 ký tự' },
          {
            required: true,
            message: 'Vui lòng điền tên',
          },
          { type: 'email', message: 'sai định dạng' },
        ]}>
        <Input />
      </Form.Item>

      <Form.Item label="SĐT" name="phoneNumber" rules={[
          { min: 5, message: 'Tối thiểu 5 ký tự' },
          {
            required: true,
            message: 'Vui lòng điền tên',
          },
          { max: 3000, message: 'Tối đa 300 ký tự' },
        ]}>
        <Input />
      </Form.Item>

      <Form.Item label="Địa chỉ" name="address" rules={[
          { min: 5, message: 'Tối thiểu 5 ký tự' },
          { max: 3000, message: 'Tối đa 300 ký tự' },
          {
            required: true,
            message: 'Vui lòng điền tên',
          },
        ]}>
        <Input />
      </Form.Item>

      {!isHiddenSubmit && (
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      )}
    </Form>
  );
}

export default memo(SupplierForm);
