import EntityList from '../../features/catalog/EntityList'
import { useCatalogEntities } from '../../hooks/useCatalogEntities'

export default function BrandList() {
  const { entities: rows, loading, error, refresh } = useCatalogEntities('brand')
  return <EntityList entity="brand" rows={rows} loading={loading} error={error} onRetry={() => refresh().catch(() => {})} />
}
