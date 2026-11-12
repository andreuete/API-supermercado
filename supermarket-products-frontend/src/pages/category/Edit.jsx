import EntityForm from '../../features/catalog/EntityForm'
import { useCatalogEntities } from '../../hooks/useCatalogEntities'
import { useCatalogForm } from '../../hooks/useCatalogForm'

export default function CategoryEdit() {
  const catalog = useCatalogEntities('category', { autoLoad: false })
  const form = useCatalogForm('category', 'edit', catalog)
  return <EntityForm entity="category" mode="edit" {...form} />
}
