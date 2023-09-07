const { JSDOM } = require("jsdom");
const axios = require("axios");

/**
 * get the html of the url as a document.
 * @param {string} url The website you want to fetch
 * @returns
 */
async function fetchHTML(url) {
  try {
    const response = await axios.get(url);
    response.status;
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    return document;
  } catch {
    return null;
  }
}
/**
 * regex search an attribute inside a document.
 * @param {Document} document
 * @param {string} attribute
 * @param {RegExp} regex
 * @returns
 */
function querySelectorAllRegex(document, attribute, regex) {
  const regexPattern = regex;

  // Select all elements with the attribute 'data-custom-attribute'
  const elementsWithAttribute = document.querySelectorAll(`[${attribute}]`);

  // Filter elements based on the regular expression pattern
  const matchingElements = Array.from(elementsWithAttribute).filter(
    (element) => {
      const attributeValue = element.getAttribute(attribute);
      return regexPattern.test(attributeValue);
    }
  );
  return matchingElements;
}

/**
 * Check if the manga is mature by genres.
 * @param {String[]} genres
 */
function isMature(genres) {
  let NSFWgenres = ["mature", "smut"];
  for (let i = 0; i < genres.length; i++) {
    let genre = genres[i].toLowerCase();
    if (NSFWgenres.includes(genre)) return true;
  }
  return false;
}

module.exports = { fetchHTML, querySelectorAllRegex, isMature };
