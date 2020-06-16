import * as yup from 'yup';

const generateId = (url) => {
  const regExp = url.match(/(?<=:\/\/).*/g);
  return regExp ? regExp.join() : regExp;
};

const isDuplicate = (feeds) => (userInput) => {
  const listOfFeedsId = feeds.map(({ id }) => id);
  return !listOfFeedsId.includes(generateId(userInput));
};

const validate = (fields, feeds) => {
  const schema = yup.object().shape({
    userInput: yup.string()
      .url()
      .min(1)
      .test('duplicate', 'Rss already exists', isDuplicate(feeds)),
  });

  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (err) {
    return err.inner;
  }
};
export { validate, generateId };
