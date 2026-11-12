import EntityList from '../../features/catalog/EntityList'
import { useCatalogEntities } from '../../hooks/useCatalogEntities'

export default function CategoryList() {
  const { entities: rows, loading, error, refresh } = useCatalogEntities('category')
  return <EntityList entity="category" rows={rows} loading={loading} error={error} onRetry={() => refresh().catch(() => {})} />
}
