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

export const showWonPopup = (restart, score) => {
  Swal.fire({
    title: '<h2>🎉 WON 🎉</h2>',
    html: `<h3>Your score: ${score}</h3>`,
    showCancelButton: true,
    confirmButtonText: `Restart`,
    showCloseButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      restart();
    }
  });
};
