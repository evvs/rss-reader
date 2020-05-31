import axios from 'axios';
import watch from './watchers';
import parseXml from './parser';
import { validate } from './utils';
import _ from 'lodash';

const app = () => {
  const state = {
    status: 'loaded',
    rssInputForm: {
      userInput: null,
      valid: null,
    },
    feeds: {
      activeFeeds: [],
      lastAddedFeed: null,
    },
  };

  const urlInputField = document.getElementById('urlInput');
  const rssForm = document.querySelector('form');

  urlInputField.addEventListener('input', (e) => {
    if (!e.target.value.length) {
      state.rssInputForm.valid = false;
      return;
    }
    state.rssInputForm.userInput = e.target.value;
    const validationErrors = validate(state.rssInputForm);
    state.rssInputForm.valid = !validationErrors.length;
  });

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.status = 'loading';
    const proxy = 'https://cors-anywhere.herokuapp.com';

    axios.get(`${proxy}/${state.rssInputForm.userInput}`)
      .then((response) => {
        state.status = 'loaded';
        const { data } = response;
        const feed = parseXml(data);

        state.feeds.lastAddedFeed = feed;
        state.feeds.activeFeeds.push(feed);
      })
      .then(() => console.log(state))
      .catch((err) => console.log(err));
  });

  watch(state);
};

export default app;
