const { JSDOM } = require("jsdom");
const axios = require("axios");
/**
 * get the html of the url as a document.
 * @param {string} url The website you want to fetch
 * @returns
 */
async function fetchHTML(url) {
  const response = await axios.get(url);
  const dom = new JSDOM(response.data);
  const document = dom.window.document;
  return document;
}
/**
 *
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


module.exports = { fetchHTML, querySelectorAllRegex };
