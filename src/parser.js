import { generateId } from './utils';

export default (rssXml) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(rssXml, 'application/xml');
  const error = data.querySelector('parsererror');

  if (error) throw new Error('parsingError');

  const listItems = data.querySelectorAll('item');
  const feedTitle = data.querySelector('title').textContent;
  const feedDescription = data.querySelector('description').textContent;
  const feedLink = data.querySelector('link').textContent;
  const id = generateId(feedLink);
  const posts = [];

  listItems.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    posts.push({ title, description, link });
  });

  return {
    id, feedTitle, feedDescription, posts,
  };
};
