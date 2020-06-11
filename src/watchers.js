import WatchJS from 'melanke-watchjs';
import _ from 'lodash';

const generatePosts = (posts) => posts.map((post) => {
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


const generateList = (listOfPosts, listId) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  ul.setAttribute('data-feedid', `${listId}`);
  listOfPosts.forEach((post) => {
    ul.append(post);
  });
  return ul;
};

export default (state) => {
  const { watch } = WatchJS;
  const inputFrom = document.querySelector('form');
  const jumbotron = document.querySelector('.jumbotron');
  const urlInputField = document.getElementById('urlInput');
  const submitButton = document.querySelector('.btn-primary');
  const feedsList = document.querySelector('[data-feeds]');
  const postsContainer = document.querySelector('[data-posts]');

  const displayError = () => {
    if (inputFrom.nextElementSibling) inputFrom.nextElementSibling.remove();
    const errMessageContainer = document.createElement('div');
    errMessageContainer.classList.add('text-danger');
    errMessageContainer.textContent = state.outputMessage;
    jumbotron.append(errMessageContainer);
  };

  watch(state, 'rssInputForm', () => {
    if (!state.rssInputForm.valid) {
      displayError();
      submitButton.setAttribute('disabled', '');
      urlInputField.classList.add('is-invalid');
      return;
    }
    if (inputFrom.nextElementSibling) inputFrom.nextElementSibling.remove();
    urlInputField.classList.remove('is-invalid');
    submitButton.removeAttribute('disabled');
  });

  watch(state, 'status', () => {
    const loadingSpinner = submitButton.querySelector('span.spinner-border');
    if (state.status === 'loading') {
      submitButton.setAttribute('disabled', '');
      loadingSpinner.removeAttribute('hidden');
      return;
    }
    if (state.status === 'loaded') {
      const {
        id, feedTitle, feedDescription, posts,
      } = _.last(state.feeds.activeFeeds);

      const feed = document.createElement('li');
      const feedHeader = document.createElement('h5');
      const listOfPosts = generatePosts(posts);
      feedHeader.textContent = `${feedTitle}`;
      feed.classList.add('list-group-item');
      feed.append(feedHeader);
      feed.append(`${feedDescription}`);
      feed.setAttribute('data-feedid', `${id}`);
      feedsList.append(feed);
      postsContainer.append(generateList(listOfPosts, id));
    }
    if (state.status === 'errorWhileLoading') {
      displayError();
    }
    submitButton.removeAttribute('disabled');
    loadingSpinner.setAttribute('hidden', '');
  });

  watch(state.feeds, 'newPosts', () => {
    const { feedId, newPosts } = state.feeds.newPosts;
    const listPosts = document.querySelector(`ul[data-feedId='${feedId}']`);

    generatePosts(newPosts).forEach((post) => {
      listPosts.append(post);
    });
  });
};
