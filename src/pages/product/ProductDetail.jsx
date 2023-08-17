import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import 'numeral/locales/vi';

import axiosClient from '../../libraries/axiosClient';
import ProductForm from '../../components/ProductForm';
import { LOCATIONS } from 'constants/index';

const MESSAGE_TYPE = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

numeral.locale('vi');

export default function ProductDetail() {
  const params = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [productForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onShowMessage = useCallback(
    (content, type = MESSAGE_TYPE.SUCCESS) => {
      messageApi.open({
        type: type,
        content: content,
      });
    },
    [messageApi],
  );

  const onDeleteProduct = useCallback(async () => {
    try {
      const response = await axiosClient.patch(`products/delete/${params.id}`);

      onShowMessage(response.data.message);

      navigate(LOCATIONS.PRODUCTS);
    } catch (error) {
      console.log('««««« error »»»»»', error);
    }
  }, [navigate, onShowMessage, params.id]);

  const getSuppliers = useCallback(async () => {
    try {
      const res = await axiosClient.get('/suppliers');
      setSuppliers(res.data.payload);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCategories = useCallback(async () => {
    try {
      const res = await axiosClient.get('/categories');
      setCategories(res.data.payload || []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getProductData = useCallback(async () => {
    try {
      const res = await axiosClient.get(`/products/${params.id}`);

      productForm.setFieldsValue(res.data.payload);
    } catch (error) {
      console.log(error);
    }
  }, [params.id, productForm]);

  useEffect(() => {
    getSuppliers();

    getCategories();
  }, [getCategories, getSuppliers]);

  const isEditProduct = useMemo(() => !(params.id === 'add'), [params.id]);

  const onAddProduct = useCallback(
    async (values) => {
      try {
        const res = await axiosClient.post('/products', values);

        productForm.resetFields();

        onShowMessage(res.data.message);

        navigate(LOCATIONS.PRODUCTS)
      } catch (error) {
        if (error?.response?.data?.errors) {
          error.response.data.errors.map((e) =>
            onShowMessage(e, MESSAGE_TYPE.ERROR),
          );
        }
      }
    },
    [navigate, onShowMessage, productForm],
  );

  useEffect(() => {
    if (isEditProduct) {
      getProductData();
    }
  }, [getProductData, isEditProduct, params.id]);

  return (
    <>
      {contextHolder}

      <ProductForm
        form={productForm}
        suppliers={suppliers}
        categories={categories}
        formName="product-form"
        optionStyle={{
          maxWidth: 900,
          margin: '60px auto',
        }}
        onFinish={onAddProduct}
      />

      {isEditProduct && (
        <Popconfirm
          title="Are you sure to delete?"
          okText="Đồng ý"
          cancelText="Đóng"
          onConfirm={onDeleteProduct}
        >
          <Button danger type="dashed" icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      )}
    </>
  );
}
