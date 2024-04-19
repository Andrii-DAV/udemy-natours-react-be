/* eslint-disable */
import { showAlert } from './alerts';
import axios from 'axios';

type Settings = 'userInfo' | 'password';
type UserInfoProps = {
  email: string;
  name: string;
};
type PasswordProps = {
  newPassword: string;
  oldPassword: string;
  passwordConfirm: string;
};
export type Data = UserInfoProps | PasswordProps | FormData;

export const initSettingForms = () => {
  const saveSettingsForm = document.querySelector('.form-user-data');
  const changePasswordForm = document.querySelector('.form-user-password');

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
};

export const updateSettings = async (data: Data, type: Settings) => {
  try {
    console.log(data, 'data');

    const {
      data: { status },
    } = await axios({
      method: 'PATCH',
      url: `http://localhost:8000/api/v1/users/${
        type === 'userInfo' ? 'updateCurrentUser' : 'updatePassword'
      }`,
      data: data,
    });

    if (status === 'success') {
      showAlert(status, `Successfully updated!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
