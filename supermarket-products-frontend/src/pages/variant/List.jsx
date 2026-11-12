import ManagementList from '../../features/management/ManagementList'
import { useVariants } from '../../hooks/useVariants'

export default function VariantList() {
  const management = useVariants()
  return <ManagementList entity="variant" {...management} />
}
