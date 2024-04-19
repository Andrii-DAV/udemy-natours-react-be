import { bookTour } from './stripe';

export const initBookTourBtn = () => {
  const bookBtn = document.querySelector('#book-tour');

  if (bookBtn) {
    bookBtn.addEventListener(
      'click',
      async ({ target }: Event & { target: HTMLButtonElement }) => {
        target.textContent = 'Processing...';
        await bookTour(target.dataset.tourId);
        target.textContent = 'Book tour now!';
      },
    );
  }
};
