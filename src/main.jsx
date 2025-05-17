import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './Home.jsx';
import Explorer from './App.jsx';
import './index.css';
import './App.css';
import { NetworkProvider } from './context/NetworkContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <NetworkProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>  
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<Explorer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </NetworkProvider>
);