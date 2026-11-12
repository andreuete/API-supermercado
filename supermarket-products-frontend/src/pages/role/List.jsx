import ManagementList from '../../features/management/ManagementList'
import { useRoles } from '../../hooks/useRoles'

export default function RoleList() {
  const management = useRoles()
  return <ManagementList entity="role" {...management} />
}
