import EntityForm from '../../features/catalog/EntityForm'
import { useCatalogEntities } from '../../hooks/useCatalogEntities'
import { useCatalogForm } from '../../hooks/useCatalogForm'

export default function BrandEdit() {
  const catalog = useCatalogEntities('brand', { autoLoad: false })
  const form = useCatalogForm('brand', 'edit', catalog)
  return <EntityForm entity="brand" mode="edit" {...form} />
}
