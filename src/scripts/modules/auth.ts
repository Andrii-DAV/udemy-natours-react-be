import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email: string, password: string) => {
  try {
    const res = await axios({
      url: 'http://localhost:8000/api/v1/users/login',
      method: 'POST',

      data: {
        email: email,
        password: password,
      },
    });

    const {
      data: { status },
    } = res;

    if (status === 'success') {
      showAlert(status, `Logged in successfylly`);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:8000/api/v1/users/logout',
    });
    if ((res.data.status = 'success')) location.reload();
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

export const initLogout = () => {
  const logoutBtn = document.querySelector('.nav__el--logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await logout();
    });
  }
};
