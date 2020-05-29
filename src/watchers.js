import WatchJS from 'melanke-watchjs';

export default (state) => {
  const { watch } = WatchJS;
  const urlInputField = document.getElementById('urlInput');
  const submitButton = document.querySelector('.btn-primary');

  watch(state.rssInputForm, 'valid', () => {
    if (state.rssInputForm.valid) {
      urlInputField.classList.remove('is-invalid');
      submitButton.removeAttribute('disabled');
      return;
    }
    submitButton.setAttribute('disabled', '');
    urlInputField.classList.add('is-invalid');
  });
};
