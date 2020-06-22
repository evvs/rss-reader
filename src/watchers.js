import WatchJS from 'melanke-watchjs';
import _ from 'lodash';
import i18next from 'i18next';

export default (state) => {
  const { watch } = WatchJS;
  const inputForm = document.querySelector('form');
  const jumbotron = document.querySelector('.jumbotron');
  const urlInputField = document.getElementById('urlInput');
  const submitButton = document.querySelector('.btn-primary');
  const feedsList = document.querySelector('[data-feeds]');
  const postsContainer = document.querySelector('[data-posts] ul');
  const loadingSpinner = submitButton.querySelector('span.spinner-border');

  const addFeed = () => {
    const {
      feedTitle, feedDescription,
    } = _.last(state.feeds);
    const feed = document.createElement('li');
    const feedHeader = document.createElement('h5');
    feedHeader.textContent = `${feedTitle}`;
    feed.classList.add('list-group-item');
    feed.append(feedHeader);
    feed.append(`${feedDescription}`);
    feedsList.append(feed);
  };

  const renderPosts = () => {
    postsContainer.innerHTML = '';
    state.posts.forEach((post) => {
      const { title, link, description } = post;
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
      postsContainer.append(li);
    });
  };

  const form = {
    submit: {
      enable() { submitButton.removeAttribute('disabled'); },
      disable() { submitButton.setAttribute('disabled', ''); },
    },
    inputField: {
      setValid() { urlInputField.classList.remove('is-invalid'); },
      setInvalid() { urlInputField.classList.add('is-invalid'); },
    },
    error: {
      add() {
        if (inputForm.nextElementSibling) this.remove();
        const errMessageContainer = document.createElement('div');
        errMessageContainer.classList.add('text-danger');
        errMessageContainer.textContent = state.form.errors.map(({ type }) => i18next.t(`formErrors.${type}`)).join('. ');
        jumbotron.append(errMessageContainer);
      },
      remove() { inputForm.nextElementSibling.remove(); },
    },
    loadingSpinner: {
      display() { loadingSpinner.removeAttribute('hidden'); },
      hide() { loadingSpinner.setAttribute('hidden', ''); },
    },
  };

  watch(state.form, 'valid', () => {
    if (!state.form.valid) {
      form.error.add();
      form.inputField.setInvalid();
      form.submit.disable();
      return;
    }
    if (inputForm.nextElementSibling) form.error.remove();
    form.inputField.setValid();
    form.submit.enable();
  });

  watch(state.form, 'status', () => {
    switch (state.form.status) {
      case 'filling':
        form.submit.enable();
        break;
      case 'processing':
        form.submit.disable();
        form.loadingSpinner.display();
        break;

      case 'processed':
        form.loadingSpinner.hide();
        break;

      case 'failed':
        form.error.add();
        form.submit.enable();
        form.loadingSpinner.hide();
        break;

      default:
        throw new Error(`Unexpected form status: ${state.form.status}`);
    }
  });
  watch(state, 'feeds', () => {
    addFeed();
  });
  watch(state, 'posts', () => {
    renderPosts();
  });
};
