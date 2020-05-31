import * as yup from 'yup';

const validate = (fields) => {
  const schema = yup.object().shape({
    userInput: yup.string().url(),
  });

  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (err) {
    return err.inner;
  }
};

const generateId = (url) => url.match(/(?<=:\/\/).*/g).join();

export { validate, generateId };
