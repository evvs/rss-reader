import * as yup from 'yup';

const generateId = (url) => url.match(/(?<=:\/\/).*/g).join();

const validate = (fields) => {

  const schema = yup.object().shape({
    userInput: yup.string().url().min(1),
  });

  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (err) {
    console.log(err)
    return err.inner;
  }
};

export { validate, generateId };
