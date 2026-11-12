import ManagementList from '../../features/management/ManagementList'
import { useUsers } from '../../hooks/useUsers'

export default function UserList() {
  const management = useUsers()
  return <ManagementList entity="user" {...management} />
}
