import ManagementForm from '../../features/management/ManagementForm'
import { useVariants } from '../../hooks/useVariants'
import { useManagementForm } from '../../hooks/useManagementForm'

export default function VariantEdit() {
  const management = useVariants({ autoLoad: false })
  const form = useManagementForm('variant', 'edit', management)
  return <ManagementForm entity="variant" mode="edit" {...form} />
}
