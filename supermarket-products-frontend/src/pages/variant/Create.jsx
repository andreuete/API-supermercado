import ManagementForm from '../../features/management/ManagementForm'
import { useVariants } from '../../hooks/useVariants'
import { useManagementForm } from '../../hooks/useManagementForm'

export default function VariantCreate() {
  const management = useVariants({ autoLoad: false })
  const form = useManagementForm('variant', 'create', management)
  return <ManagementForm entity="variant" mode="create" {...form} />
}
