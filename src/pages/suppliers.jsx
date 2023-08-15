import React, { useCallback, useState } from 'react';
import {
  Table,
  Button,
  Form,
  message,
  Alert,
  Popconfirm,
  Space,
  Modal,
} from 'antd';

import axiosClient from '../libraries/axiosClient';
import SupplierForm from '../components/SupplierForm';

const MESSAGE_TYPE = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

export default function SuppliersPage() {
  const [createForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [refresh, setRefresh] = useState(0);

  const onShowMessage = useCallback(
    (content, type = MESSAGE_TYPE.SUCCESS) => {
      messageApi.open({
        type: type,
        content: content,
      });
    },
    [messageApi],
  );

  const onFinish = useCallback(
    async (values) => {
      try {
        const res = await axiosClient.post('/suppliers', {
          ...values,
          isDeleted: false,
        });

        setRefresh((preState) => preState + 1);
        createForm.resetFields();

        onShowMessage(res.data.message);
      } catch (error) {
        if (error?.response?.data?.errors) {
          error.response.data.errors.map((e) =>
            onShowMessage(e, MESSAGE_TYPE.ERROR),
          );
        }
      }
    },
    [createForm, onShowMessage],
  );

  return (
    <>
      {contextHolder}

      <SupplierForm
        form={createForm}
        onFinish={onFinish}
        formName="add-supplier-form"
        optionStyle={{
          maxWidth: 900,
          margin: '60px auto',
        }}
      />
    </>
  )
}
