import Swal from 'sweetalert2';

export function showLuxuryAlert(title: string, html: string, icon: 'success' | 'info' | 'warning' | 'error' = 'success') {
  return Swal.fire({
    title,
    html,
    icon,
    customClass: {
      popup: 'dark-luxury-swal',
      confirmButton: 'dark-luxury-btn'
    },
    background: '#0D0D0D',
    color: '#FFFFFF',
    confirmButtonColor: '#FFFFFF',
    confirmButtonText: 'CONFIRM'
  });
}

export function showSanctumNotice() {
  return Swal.fire({
    title: 'SANCTUM ACCESS RESTRICTED',
    html: 'This portal requires Ari Smith\'s encrypted administrative key. Public visitors may browse the repertoire and schedule private dates via the booking engine.',
    icon: 'info',
    customClass: {
      popup: 'dark-luxury-swal',
      confirmButton: 'dark-luxury-btn'
    },
    background: '#0D0D0D',
    color: '#FFFFFF',
    confirmButtonColor: '#FFFFFF',
    confirmButtonText: 'UNDERSTOOD'
  });
}
