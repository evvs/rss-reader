import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import watch from './watchers';
import parse from './parser';
import resources from './locales';
import { validate, generateId } from './utils';

export default () => {
  const state = {
    form: {
      status: '',
      userInput: '',
      validationState: true,
      errors: [],
    },
    feeds: [],
    posts: [],
  };

  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  });

  const checkNewPosts = (url, proxy, feedId) => {
    axios.get(`${proxy}/${url}`)
      .then((response) => {
        const { data } = response;
        const { posts } = parse(data);
        const newPosts = _.differenceBy(posts, state.posts, 'link');
        state.posts = [...state.posts, ...newPosts.map((post) => ({ ...post, feedId }))];
        setTimeout(checkNewPosts, 5000, url, proxy, feedId);
      });
  };

  const urlInputField = document.getElementById('urlInput');
  const rssForm = document.querySelector('form');

  urlInputField.addEventListener('input', (e) => {
    state.form.status = 'filling';
    state.form.userInput = e.target.value;
    const validationErrors = validate(state.form, state.feeds);
    if (validationErrors.length > 0) {
      state.form.validationState = false;
      state.form.errors = validationErrors;
      return;
    }
    state.form.validationState = true;
  });

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();

    state.form.status = 'processing';
    const proxy = 'https://cors-anywhere.herokuapp.com';
    const url = state.form.userInput;
    const feedId = generateId(url);
    axios.get(`${proxy}/${url}`)
      .then((response) => {
        state.form.userInput = '';
        state.form.status = 'processed';
        const { data } = response;
        const { posts, feedTitle, feedDescription } = parse(data);
        const feed = { feedId, feedTitle, feedDescription };
        state.feeds = [...state.feeds, feed];
        state.posts = [...state.posts, ...posts.map((post) => ({ ...post, feedId }))];
      })
      .then(() => checkNewPosts(url, proxy, feedId))
      .catch((err) => {
        state.form.status = 'failed';
        if (err.request) {
          state.form.errors = [{ ...err, type: 'requestError' }];
          return;
        }
        state.form.errors = [{ ...err, type: 'parsingError' }];
      });
  });

  watch(state);
};
