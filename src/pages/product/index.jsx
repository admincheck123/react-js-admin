import React, { useCallback, useEffect, useState } from 'react';
import {
  Table,
  Button,
  Form,
  message,
  Alert,
  Popconfirm,
  Space,
  Modal,
  Pagination,
} from 'antd';
import numeral from 'numeral';
import 'numeral/locales/vi';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import axiosClient from '../../libraries/axiosClient';
import ProductForm from '../../components/ProductForm';

const MESSAGE_TYPE = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

numeral.locale('vi');

const DEFAULT_LIMIT = 3;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  console.log('««««« total »»»»»', total);

  const [refresh, setRefresh] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onShowToast = useCallback(
    ({
      message = 'Thành công',
      description = 'Thành công',
      type = MESSAGE_TYPE.SUCCESS,
    }) => {
      return (
        <Alert
          message={message}
          description={description}
          type={type}
          showIcon
        />
      );
    },
    [],
  );

  const onShowMessage = useCallback(
    (content, type = MESSAGE_TYPE.SUCCESS) => {
      messageApi.open({
        type: type,
        content: content,
      });
    },
    [messageApi],
  );

  const onSelectProduct = useCallback(
    (data) => () => {
      setEditModalVisible(true);

      setSelectedProduct(data);

      updateForm.setFieldsValue(data);
    },
    [updateForm],
  );

  const onDeleteProduct = useCallback(
    (productId) => async () => {
      try {
        const response = await axiosClient.patch(`products/delete/${productId}`);

        onShowMessage(response.data.message);

        setRefresh((prevState) => prevState + 1);
      } catch (error) {
        console.log('««««« error »»»»»', error);
      }
    },
    [onShowMessage],
  );

  const onEditFinish = useCallback(
    async (values) => {
      try {
        const response = await axiosClient.put(
          `products/${selectedProduct._id}`,
          values,
        );

        updateForm.resetFields();

        setEditModalVisible(false);

        onShowMessage(response.data.message);

        const newList = products.map((item) => {
          if (item._id === selectedProduct._id) {
            return {
              ...item,
              ...values,
            };
          } 
          return item;
        })

        setProducts(newList);

        // setRefresh((prevState) => prevState + 1);
      } catch (error) {
        console.log('««««« error »»»»»', error);
      }
    },
    [onShowMessage, products, selectedProduct?._id, updateForm],
  );

  const columns = [
    {
      title: 'No',
      dataIndex: 'No',
      key: 'no',
      width: '1%',
      render: function (a, b, c) {
        return <span>{c + 1}</span>;
      },
    },
    {
      title: 'Tên SP',
      dataIndex: 'name',
      key: 'name',
      render: function (text, record) {
        return <Link to={`${record._id}`}>{text}</Link>;
      },
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'supplierName',
      render: function (text, record) {
        return (
          <Link to={`suppliers/${record.supplier?._id}`}>
            {record.supplier?.name}
          </Link>
        ); // record.supplier && record.supplier._id
      },
    },
    {
      title: 'Tên SP',
      dataIndex: 'category',
      key: 'categoryName',
      render: function (text, record) {
        return (
          <Link to={`categories/${record.category._id}`}>
            {record.category.name}
          </Link>
        );
      },
    },
    {
      title: 'Giá gốc',
      dataIndex: 'price',
      key: 'price',
      render: function (text) {
        return <strong>{numeral(text).format('0,0$')}</strong>;
      },
    },
    {
      title: 'Chiết khấu',
      dataIndex: 'discount',
      key: 'discount',
      render: function (text) {
        return <strong>{`${text}%`}</strong>;
      },
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: function (text) {
        return <strong>{numeral(text).format('0,0')}</strong>;
      },
    },
    {
      title: 'Giá bán',
      dataIndex: 'discountedPrice',
      key: 'discountedPrice',
      render: function (text, record, index) {
        const discountedPrice = record.price * (100 - record.discount) / 100;
        return <strong>{numeral(discountedPrice).format('0,0$')}</strong>;
      },
    },
    {
      title: 'Mô tả',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: '1%',
      render: (text, record, index) => {
        return (
          <Space>
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={onSelectProduct(record)}
            />

            <Popconfirm
              title="Mày chắc muốn xóa không"
              okText="Đồng ý"
              cancelText="Hủy"
              onConfirm={onDeleteProduct(record._id)}
            >
              <Button danger type="dashed" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

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

  const getProducts = useCallback(async (page, pageSize) => {
    try {
      const res = await axiosClient.get(`/products?page=${page}&pageSize=${pageSize}`);
      setProducts(res.data.payload);
      setTotal(res.data.total);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onChangePage = useCallback((page, pageSize) => {
    getProducts(page, pageSize);
  }, [getProducts]);

  useEffect(() => {
    getSuppliers();

    getCategories();
  }, [getCategories, getSuppliers]);

  useEffect(() => {
    getProducts(1, DEFAULT_LIMIT);
  }, [getProducts, refresh]);

  return (
    <>
      {contextHolder}
      <Table
        rowKey="_id"
        dataSource={products}
        columns={columns}
        pagination={false}
      />

      <Pagination
        defaultCurrent={1}
        total={total}
        pageSize={DEFAULT_LIMIT}
        onChange={onChangePage}
      />

      <Modal
        open={editModalVisible}
        centered
        title="Cập nhật thông tin"
        onCancel={() => {
          setEditModalVisible(false);
        }}
        cancelText="Đóng"
        okText="Lưu"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <ProductForm
          form={updateForm}
          suppliers={suppliers}
          categories={categories}
          onFinish={onEditFinish}
          formName="update-product"
          isHiddenSubmit
        />
      </Modal>
    </>
  );
}
