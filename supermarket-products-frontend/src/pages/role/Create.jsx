import ManagementForm from '../../features/management/ManagementForm'
import { useRoles } from '../../hooks/useRoles'
import { useManagementForm } from '../../hooks/useManagementForm'

export default function RoleCreate() {
  const management = useRoles({ autoLoad: false })
  const form = useManagementForm('role', 'create', management)
  return <ManagementForm entity="role" mode="create" {...form} />
}
