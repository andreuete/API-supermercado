import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { FormSkeleton } from '../components/Skeleton'

const ProductList = lazy(() => import('../pages/product/List'))
const ProductCreate = lazy(() => import('../pages/product/Create'))
const ProductEdit = lazy(() => import('../pages/product/Edit'))
const ProductDetail = lazy(() => import('../pages/product/Detail'))
const BrandList = lazy(() => import('../pages/brand/List'))
const BrandCreate = lazy(() => import('../pages/brand/Create'))
const BrandEdit = lazy(() => import('../pages/brand/Edit'))
const CategoryList = lazy(() => import('../pages/category/List'))
const CategoryCreate = lazy(() => import('../pages/category/Create'))
const CategoryEdit = lazy(() => import('../pages/category/Edit'))
const VariantList = lazy(() => import('../pages/variant/List'))
const VariantCreate = lazy(() => import('../pages/variant/Create'))
const VariantEdit = lazy(() => import('../pages/variant/Edit'))
const UserList = lazy(() => import('../pages/user/List'))
const UserCreate = lazy(() => import('../pages/user/Create'))
const UserEdit = lazy(() => import('../pages/user/Edit'))
const RoleList = lazy(() => import('../pages/role/List'))
const RoleCreate = lazy(() => import('../pages/role/Create'))
const RoleEdit = lazy(() => import('../pages/role/Edit'))

export default function AppRoutes() {
  return <Suspense fallback={<div className="mx-auto max-w-4xl p-8"><div className="panel"><FormSkeleton /></div></div>}>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/new" element={<ProductCreate />} />
        <Route path="/products/:id/edit" element={<ProductEdit />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/brands" element={<BrandList />} />
        <Route path="/brands/new" element={<BrandCreate />} />
        <Route path="/brands/:id/edit" element={<BrandEdit />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/new" element={<CategoryCreate />} />
        <Route path="/categories/:id/edit" element={<CategoryEdit />} />
        <Route path="/variants" element={<VariantList />} />
        <Route path="/variants/new" element={<VariantCreate />} />
        <Route path="/variants/:productId/:sku/edit" element={<VariantEdit />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserCreate />} />
        <Route path="/users/:id/edit" element={<UserEdit />} />
        <Route path="/roles" element={<RoleList />} />
        <Route path="/roles/new" element={<RoleCreate />} />
        <Route path="/roles/:id/edit" element={<RoleEdit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </Suspense>
}