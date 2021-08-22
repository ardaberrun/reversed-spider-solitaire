import Swal from 'sweetalert2';

export const showError = (message = 'Invalid Operation!') => {
  Swal.fire({
    icon: 'error',
    text: message,
    toast: true,
    position: 'bottom-end',
    timer: 3000,
    showConfirmButton: false,
    timerProgressBar: true,
  });
};

export const showWonPopup = (restart) => {
  Swal.fire({
    title: '<h1>🎉🎉</h1>',
    html: '<h2>You Won!</h2>',
    showCancelButton: true,
    confirmButtonText: `Restart`,
    showCloseButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      restart();
    }
  });
};
