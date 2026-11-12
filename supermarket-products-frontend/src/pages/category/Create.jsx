import EntityForm from '../../features/catalog/EntityForm'
import { useCatalogEntities } from '../../hooks/useCatalogEntities'
import { useCatalogForm } from '../../hooks/useCatalogForm'

export default function CategoryCreate() {
  const catalog = useCatalogEntities('category', { autoLoad: false })
  const form = useCatalogForm('category', 'create', catalog)
  return <EntityForm entity="category" mode="create" {...form} />
}
