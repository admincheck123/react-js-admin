import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";

import axiosClient from 'libraries/axiosClient';
import { LOCATIONS } from 'constants/index';

import Login from 'pages/login';
import CategoryPage from 'pages/Categories';
import SupplierPage from 'pages/suppliers';
import ProductList from 'pages/product';
import ProductDetail from 'pages/product/ProductDetail';
import NotFound from 'pages/notFound';

import './App.css';

function App() {
  const navigate = useNavigate();

  const token = window.localStorage.getItem('TOKEN');

  // useEffect(() => {
  //   if (token) {
  //     axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
  //   } else {
  //     navigate(LOCATIONS.LOGIN);
  //   }
  // }, [navigate, token]);


  return (
    <Routes>
      <Route index element={<ProductList />} />
      <Route path="/products" element={<ProductList />} />
      {/* <Route path={LOCATIONS.PRODUCTS_ADD} element={<ProductDetail />} /> */}
      {/* <Route path="products/add" element={<CreateProduct />} /> */}
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/suppliers" element={<SupplierPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
  // return (
  //   !token ? <Routes>
  //     <Route path="login" element={<Login />} />
  //   </Routes> : <Routes>
  //     <Route index element={<ProductList />} />
  //     <Route path="products" element={<ProductList />} />
  //     {/* <Route path={LOCATIONS.PRODUCTS_ADD} element={<ProductDetail />} /> */}
  //     {/* <Route path="products/add" element={<CreateProduct />} /> */}
  //     <Route path="products/:id" element={<ProductDetail />} />
  //     <Route path="categories" element={<CategoryPage />} />
  //     <Route path="suppliers" element={<SupplierPage />} />
  //     <Route path="*" element={<NotFound />} />
  //   </Routes>
  // );
}

export default App;
