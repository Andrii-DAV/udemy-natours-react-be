import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const saveSettingsForm = document.querySelector('.form-user-data');
const changePasswordForm = document.querySelector('.form-user-password');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    await login(
      (document.querySelector('#email') as HTMLInputElement)?.value,
      (document.querySelector('#password') as HTMLInputElement)?.value,
    );
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await logout();
  });
}

if (saveSettingsForm) {
  saveSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (saveSettingsForm.querySelector('#email') as HTMLInputElement)
      .value;
    const name = (saveSettingsForm.querySelector('#name') as HTMLInputElement)
      .value;

    await updateSettings(
      {
        email,
        name,
      },
      'userInfo',
    );
  });
}

if (changePasswordForm) {
  changePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.querySelector(
      '.btn--save-password',
    ) as HTMLButtonElement;

    saveBtn.disabled = true;
    saveBtn.textContent = 'Uploading...';

    const oldPassword: HTMLInputElement =
      changePasswordForm.querySelector('#password-current');
    const newPassword: HTMLInputElement =
      changePasswordForm.querySelector('#password');
    const passwordConfirm: HTMLInputElement =
      changePasswordForm.querySelector('#password-confirm');

    await updateSettings(
      {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
        passwordConfirm: passwordConfirm.value,
      },
      'password',
    );

    saveBtn.disabled = false;
    saveBtn.textContent = 'Save password';

    oldPassword.value = '';
    newPassword.value = '';
    passwordConfirm.value = '';
  });
}
