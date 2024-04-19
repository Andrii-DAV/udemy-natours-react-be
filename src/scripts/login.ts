// /* eslint-disable */
import { login, logout } from './modules/auth';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.form--login');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      await login(
        (document.querySelector('#email') as HTMLInputElement)?.value,
        (document.querySelector('#password') as HTMLInputElement)?.value,
      );
    });
  }
});
