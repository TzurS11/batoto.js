"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMature = exports.querySelectorAllRegex = exports.fetchHTML = void 0;
const jsdom_1 = require("jsdom");
const axios_1 = require("axios");
/**
 * get the html of the url as a document.
 * @param url The website you want to fetch
 * @returns
 */
async function fetchHTML(url) {
    try {
        const response = await axios_1.default.get(url);
        const dom = new jsdom_1.JSDOM(response.data);
        const document = dom.window.document;
        return document;
    }
    catch {
        return null;
    }
}
exports.fetchHTML = fetchHTML;
/**
 * regex search an attribute inside a document.
 * @returns
 */
function querySelectorAllRegex(document, attribute, regex) {
    const regexPattern = regex;
    // Select all elements with the attribute 'data-custom-attribute'
    const elementsWithAttribute = document.querySelectorAll(`[${attribute}]`);
    // Filter elements based on the regular expression pattern
    const matchingElements = Array.from(elementsWithAttribute).filter((element) => {
        const attributeValue = element.getAttribute(attribute) || "";
        return regexPattern.test(attributeValue);
    });
    return matchingElements;
}
exports.querySelectorAllRegex = querySelectorAllRegex;
/**
 * Check if the manga is mature by genres.
 * @param genres
 */
function isMature(genres) {
    let NSFWgenres = [
        "gore",
        "bloody",
        "violence",
        "ecchi",
        "adult",
        "mature",
        "smut",
        "hentai",
    ];
    for (let i = 0; i < genres.length; i++) {
        let genre = genres[i].toLowerCase();
        if (NSFWgenres.includes(genre))
            return true;
    }
    return false;
}
exports.isMature = isMature;
// module.exports = { fetchHTML, querySelectorAllRegex, isMature };
