import ManagementForm from '../../features/management/ManagementForm'
import { useUsers } from '../../hooks/useUsers'
import { useManagementForm } from '../../hooks/useManagementForm'

export default function UserCreate() {
  const management = useUsers({ autoLoad: false })
  const form = useManagementForm('user', 'create', management)
  return <ManagementForm entity="user" mode="create" {...form} />
}
