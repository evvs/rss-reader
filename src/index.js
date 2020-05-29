import * as yup from 'yup';
import axios from 'axios';
import watch from './watchers';
import parseXml from './parser';

const schema = yup.object().shape({
  userInput: yup.string().url(),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (err) {
    return err.inner;
  }
};

const app = () => {
  const state = {
    rssInputForm: {
      userInput: null,
      valid: true,
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
    const proxy = 'https://cors-anywhere.herokuapp.com';

    axios.get(`${proxy}/${state.rssInputForm.userInput}`)
      .then((data) => parseXml(data));
  });

  watch(state);
};

export default app;
