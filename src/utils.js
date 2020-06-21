import * as yup from 'yup';

const generateId = (url) => {
  const regExp = url.match(/(?<=:\/\/).*/g);
  return regExp ? regExp.join() : regExp;
};

const validate = (fields, feeds) => {
  const listOfFeedsUrl = feeds.map(({ url }) => url);

  const schema = yup.object().shape({
    userInput: yup.string()
      .url()
      .min(1)
      .notOneOf(listOfFeedsUrl),
  });

  try {
    schema.validateSync(fields, { abortEarly: false });
    return [];
  } catch (err) {
    return err.inner;
  }
};
export { validate, generateId };
