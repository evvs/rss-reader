import WatchJS from 'melanke-watchjs';

export default (state) => {
  const { watch } = WatchJS;
  const urlInputField = document.getElementById('urlInput');
  const submitButton = document.querySelector('.btn-primary');
  const feedsList = document.querySelector('[data-feeds]');
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
    const feed = document.createElement('li');
    const feedHeader = document.createElement('h6');
    feedHeader.textContent = `${feedTitle}`;
    feed.classList.add('list-group-item');
    feed.append(feedHeader);
    feed.append(`${feedDescription}`);
    feedsList.append(feed);
  });
};
