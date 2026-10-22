import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext'
import AppRoutes from './routes/AppRoutes'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductProvider>
        <AppRoutes />
      </ProductProvider>
    </BrowserRouter>
  </React.StrictMode>
)