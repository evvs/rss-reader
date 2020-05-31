import WatchJS from 'melanke-watchjs';

export default (state) => {
  const { watch } = WatchJS;
  const urlInputField = document.getElementById('urlInput');
  const submitButton = document.querySelector('.btn-primary');
  const feedList = document.querySelector('[data-feeds]');
  const postsList = document.querySelector('[data-posts]');

  watch(state.rssInputForm, 'valid', () => {
    if (state.rssInputForm.valid) {
      urlInputField.classList.remove('is-invalid');
      submitButton.removeAttribute('disabled');
      return;
    }
    submitButton.setAttribute('disabled', '');
    urlInputField.classList.add('is-invalid');
  });
  watch(state, 'status', () =>{
    const loadingSpinner = submitButton.querySelector('span.spinner-border');
    if (state.status === 'loading') {
      submitButton.setAttribute('disabled', '');
      loadingSpinner.removeAttribute('hidden');
      return;
    }
    submitButton.removeAttribute('disabled');
    loadingSpinner.setAttribute('hidden', '');
  });

  watch(state.feeds, 'lastAddedFeed', () => {

    const { feedTitle, feedDescription } = state.feeds.lastAddedFeed;
    const liElemFeed = document.createElement('li');
    const h6Feed = document.createElement('h6');
    h6Feed.textContent = `${feedTitle}`;
    liElemFeed.classList.add('list-group-item');
    liElemFeed.append(h6Feed);
    liElemFeed.append(`${feedDescription}`);
    feedList.append(liElemFeed);
  });
};
