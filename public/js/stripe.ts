import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId: string) => {
  try {
    const session = await axios(
      `http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`,
    );

    window.open(session.data.session.url, '_blank');
  } catch (e) {
    showAlert('error', e);
  }
};
