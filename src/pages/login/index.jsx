import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import axiosClient from 'libraries/axiosClient';
import { LOCATIONS } from 'constants/index';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const token = window.localStorage.getItem('TOKEN');

  const onLogin = async (values) => {
    try {
      const url = '/auth/login';

      const res = await axiosClient.post(url, values);

      const { token, refreshToken } = res.data;

      window.localStorage.setItem('TOKEN', token);
      window.localStorage.setItem('REFRESH_TOKEN', refreshToken);

      axiosClient.defaults.headers.Authorization = `Bearer ${token}`;

      if (token) {
        navigate(LOCATIONS.PRODUCTS_PAGE);
      }
    } catch (err) {
      console.error('««««« err »»»»»', err);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (token) {
      navigate(LOCATIONS.PRODUCTS_PAGE);
    }
  }, [navigate, token]);

  return (
    <div className="d-flex justify-content-center mt-5">
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onLogin}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default LoginPage;