import WatchJS from 'melanke-watchjs';

export default (state) => {
  const { watch } = WatchJS;
  const urlInputField = document.getElementById('urlInput');
  const submitButton = document.querySelector('.btn-primary');
  const feedsList = document.querySelector('[data-feeds]');
  const postsContainer = document.querySelector('[data-posts]');

  const generatePostsList = (posts, listId) => {
    const postsList = posts.map((post) => {
      const { title, description, link } = post;
      const container = document.createElement('div');
      const postTitle = document.createElement('a');
      postTitle.setAttribute('href', `${link}`);
      postTitle.textContent = `${title}`;
      container.append(postTitle);

      const postDescription = document.createElement('div');
      postDescription.textContent = `${description}`;
      container.append(postDescription);

      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.append(container);
      return li;
    });

    const ul = document.createElement('ul');
    ul.classList.add('list-group');
    ul.setAttribute('data-feedid', `${listId}`);
    postsList.forEach((post) => {
      ul.append(post);
    });
    return ul;
  };

  watch(state.rssInputForm, 'valid', () => {
    if (state.rssInputForm.valid) {
      urlInputField.classList.remove('is-invalid');
      submitButton.removeAttribute('disabled');
      return;
    }
    submitButton.setAttribute('disabled', '');
    urlInputField.classList.add('is-invalid');
  });

  watch(state, 'status', () => {
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
    const {
      id, feedTitle, feedDescription, posts,
    } = state.feeds.lastAddedFeed;

    const feed = document.createElement('li');
    const feedHeader = document.createElement('h5');
    feedHeader.textContent = `${feedTitle}`;
    feed.classList.add('list-group-item');
    feed.append(feedHeader);
    feed.append(`${feedDescription}`);
    feed.setAttribute('data-feedid', `${id}`);
    feedsList.append(feed);
    postsContainer.append(generatePostsList(posts, id));
  });
};
