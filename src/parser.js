export default (rssXml) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(rssXml, 'application/xml');
  const error = data.querySelector('parsererror');

  if (error) throw new Error('parsingError');

  console.log(data)
  const listItems = data.querySelectorAll('item');
  const feedTitle = data.querySelector('title').textContent;
  const feedDescription = data.querySelector('description').textContent;
  const posts = [...listItems].map((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    return { title, description, link };
  });

  return {
    feedTitle, feedDescription, posts,
  };
};
