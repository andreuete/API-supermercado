import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { FormSkeleton } from '../components/Skeleton'

const List = lazy(() => import('../pages/List'))
const Create = lazy(() => import('../pages/Create'))
const Edit = lazy(() => import('../pages/Edit'))
const Detail = lazy(() => import('../pages/Detail'))

export default function AppRoutes() {
  return <Suspense fallback={<div className="mx-auto max-w-4xl p-8"><div className="panel"><FormSkeleton /></div></div>}>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<List />} />
        <Route path="/products/new" element={<Create />} />
        <Route path="/products/:id/edit" element={<Edit />} />
        <Route path="/products/:id" element={<Detail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </Suspense>
}