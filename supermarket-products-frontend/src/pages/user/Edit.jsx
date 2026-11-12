import ManagementForm from '../../features/management/ManagementForm'
import { useUsers } from '../../hooks/useUsers'
import { useManagementForm } from '../../hooks/useManagementForm'

export default function UserEdit() {
  const management = useUsers({ autoLoad: false })
  const form = useManagementForm('user', 'edit', management)
  return <ManagementForm entity="user" mode="edit" {...form} />
}
