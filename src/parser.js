export default (xmlStr) => {
  const parser = new DOMParser();

  const data = parser.parseFromString(xmlStr, 'text/xml');

  const dataItems = data.querySelectorAll('item');

  console.log(dataItems);
};
