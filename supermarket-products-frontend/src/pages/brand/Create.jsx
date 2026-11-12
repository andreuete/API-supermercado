import EntityForm from '../../features/catalog/EntityForm'
import { useCatalogEntities } from '../../hooks/useCatalogEntities'
import { useCatalogForm } from '../../hooks/useCatalogForm'

export default function BrandCreate() {
  const catalog = useCatalogEntities('brand', { autoLoad: false })
  const form = useCatalogForm('brand', 'create', catalog)
  return <EntityForm entity="brand" mode="create" {...form} />
}
