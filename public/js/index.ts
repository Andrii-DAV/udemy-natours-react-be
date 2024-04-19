import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

const mapBox = document.querySelector('#map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const saveSettingsForm = document.querySelector('.form-user-data');
const changePasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.querySelector('#book-tour');

if (mapBox) {
  const locations = JSON.parse((mapBox as HTMLElement).dataset.locations);
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
  saveSettingsForm
    .querySelector('#photo')
    .addEventListener('change', (evt: Event) => {
      const tgt = evt.target as HTMLInputElement;
      const { files } = tgt;

      if (FileReader && files && files.length) {
        const fr = new FileReader();
        fr.onload = function () {
          const imageEl = saveSettingsForm.querySelector(
            '.form__user-photo',
          ) as HTMLImageElement;

          if (imageEl) {
            imageEl.src = fr.result as string;
          }
        };
        fr.readAsDataURL(files[0]);
      }
    });

  saveSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append(
      'email',
      (saveSettingsForm.querySelector('#email') as HTMLInputElement).value,
    );
    form.append(
      'name',
      (saveSettingsForm.querySelector('#name') as HTMLInputElement).value,
    );
    form.append(
      'photo',
      (saveSettingsForm.querySelector('#photo') as HTMLInputElement).files[0],
    );

    await updateSettings(form, 'userInfo');
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
