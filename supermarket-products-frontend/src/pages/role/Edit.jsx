import ManagementForm from '../../features/management/ManagementForm'
import { useRoles } from '../../hooks/useRoles'
import { useManagementForm } from '../../hooks/useManagementForm'

export default function RoleEdit() {
  const management = useRoles({ autoLoad: false })
  const form = useManagementForm('role', 'edit', management)
  return <ManagementForm entity="role" mode="edit" {...form} />
}
