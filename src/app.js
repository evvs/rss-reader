import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import watch from './watchers';
import parseXml from './parser';
import resources from './locales';
import { validate, generateId, isDuplicate } from './utils';

export default () => {
  const state = {
    form: {
      status: '',
      userInput: '',
      validationState: null,
      errors: {},
    },
    feeds: [],
    posts: [],
  };

  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  });
/*
  const checkNewFeeds = (url) => {
    const proxy = 'https://cors-anywhere.herokuapp.com';
    const feedId = generateId(url);
    //const alreadyAddedFeed = state.feeds.activeFeeds.find(({ id }) => id === feedId);

    axios.get(`${proxy}/${url}`)
      .then((response) => {
        const { data } = response;
        const feed = parseXml(data);
        const newPosts = _.differenceBy(feed.posts, alreadyAddedFeed.posts, 'link');
        if (newPosts.length > 0) {
          newPosts.forEach((post) => {
            alreadyAddedFeed.posts.push(post);
            state.feeds.newPosts = { feedId, newPosts };
          });
        }
        setTimeout(checkNewFeeds, 5000, url);
      });
  };
*/
  const urlInputField = document.getElementById('urlInput');
  const rssForm = document.querySelector('form');

  urlInputField.addEventListener('input', (e) => {
    state.form.status = 'filling';
    state.form.userInput = e.target.value;
    const validationErrors = validate(state.form, state.feeds);
    if (validationErrors.length > 0) {
      state.form.validationState = false;
      state.form.errors = validationErrors;
      //const { type } = validationErrors.find(({ name }) => name === 'ValidationError');
      // state.outputMessage = i18next.t(`ValidationError.${type}`);
      return;
    }
    state.form.validationState = true;
  });

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
/*
    const duplicate = state.feeds.activeFeeds
      .find(({ id }) => id === generateId(state.rssInputForm.userInput));

    if (duplicate) {
      state.form.validationState = false;
      state.form.errors = {
        type: 'duplicatedUrl',
      };
      // state.outputMessage = i18next.t('ValidationError.duplicatedUrl');
      throw new Error('Rss already exists');
    }

 */
    state.form.status = 'processing';
    const proxy = 'https://cors-anywhere.herokuapp.com';
    const url = state.form.userInput;
    axios.get(`${proxy}/${url}`)
      .then((response) => {
        state.form.userInput = '';
        state.form.status = 'processed';
        const { data } = response;
        const { posts, feedTitle, feedDescription } = parseXml(data);
        const id = generateId(url);
        const feed = { id, feedTitle, feedDescription };
        state.feeds.push(feed);
        posts.forEach((post) => {
          const { title, description, link } = post;
          state.posts.push({
            feedId: id, title, link, description,
          });
        });
      })
      //.then(() => checkNewFeeds(url))
      .catch((err) => {
        state.status = 'failed';
        if (err.request) {
          state.loadingErrors = err.request;
          state.loadingErrors.type = 'requestError';
          state.outputMessage = i18next.t('requestError', { code: `${state.loadingErrors.status}` });
          return;
        }
        state.loadingErrors = err;
        state.loadingErrors.type = 'parsingError';
        state.outputMessage = i18next.t('parsingError');
      });
  });

  watch(state);
};
