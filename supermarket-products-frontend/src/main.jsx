import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/latin-500.css'
import '@fontsource/manrope/latin-600.css'
import '@fontsource/manrope/latin-700.css'
import '@fontsource/ultra/latin-400.css'
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