import Swal from 'sweetalert2'

const base = {
  background: '#1F1F1F',
  color: '#F0F0F0',
  confirmButtonColor: '#7d3a85',
  cancelButtonColor: '#313131',
  customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl', cancelButton: 'rounded-xl' },
}

export const notifySuccess = (title, text = '') => Swal.fire({ ...base, icon: 'success', title, text, timer: 2200, showConfirmButton: false })
export const notifyError = (text, title = 'No se pudo completar') => Swal.fire({ ...base, icon: 'error', title, text, confirmButtonText: 'Entendido' })
export const confirmAction = async ({ title, text, confirmText = 'Confirmar', icon = 'warning' }) => {
  const result = await Swal.fire({
    ...base, icon, title, text, showCancelButton: true,
    confirmButtonText: confirmText, cancelButtonText: 'Cancelar',
    reverseButtons: true, focusCancel: true,
  })
  return result.isConfirmed
}