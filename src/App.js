import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CategoryPage from './pages/Categories';
import ProductList from './pages/product';
import ProductDetail from './pages/product/ProductDetail';

import './App.css';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      {/* <Route path="/" element={<Layout />}> */}
      {/* <Route index element={<Home />} /> */}
      <Route path="products" element={<ProductList />} />
      <Route path="products/:id" element={<ProductDetail />} />
      <Route path="categories" element={<CategoryPage />} />
      {/* <Route path="*" element={<NoPage />} /> */}
      {/* </Route> */}
    </Routes>
  </BrowserRouter>
  );
}

export default App;
