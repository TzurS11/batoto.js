"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSpecialCharsToUnicode = exports.isPageValid = exports.convertLangArrayToString = exports.isMature = exports.querySelectorAllRegex = exports.fetchHTML = void 0;
const jsdom_1 = require("jsdom");
const axios_1 = require("axios");
const url = require("url");
/**
 * get the html of the url as a document.
 * @param url The website you want to fetch
 * @returns
 */
async function fetchHTML(url, proxy) {
    url.replace("https", "http");
    try {
        let response;
        if (proxy == undefined ||
            proxy.host == undefined ||
            proxy.port == undefined) {
            response = await axios_1.default.get(url);
        }
        else {
            console.log(proxy);
            response = await axios_1.default.get(url, { proxy: proxy });
        }
        const dom = new jsdom_1.JSDOM(response.data);
        const document = dom.window.document;
        return document;
    }
    catch (error) {
        console.log(error.message);
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
        let genre = genres[i].toLowerCase().replace(/ /g, "_");
        if (NSFWgenres.includes(genre))
            return true;
    }
    return false;
}
exports.isMature = isMature;
function convertLangArrayToString(langArr) {
    let langString = "";
    langArr = [...new Set(langArr)];
    for (let i = 0; i < langArr.length; i++) {
        if (i == langArr.length - 1) {
            langString = langString + langArr[i];
        }
        else {
            langString = langString + langArr[i] + ",";
        }
    }
    return langString;
}
exports.convertLangArrayToString = convertLangArrayToString;
/**
 * check if an image is still valid. can be tested on one of the pages in a chapter to check if the image is expired
 * @param url the address of the image.
 */
function isPageValid(urlString) {
    const parsedUrl = url.parse(urlString, true);
    const expParam = parsedUrl.query.exp;
    if (!expParam) {
        console.error("No 'exp' parameter found in the URL.");
        return false;
    }
    const expirationTimestamp = parseInt(expParam, 10);
    if (isNaN(expirationTimestamp)) {
        console.error("'exp' parameter is not a valid timestamp.");
        return false;
    }
    const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    return currentTimestamp < expirationTimestamp;
}
exports.isPageValid = isPageValid;
function convertSpecialCharsToUnicode(inputString) {
    // Use encodeURIComponent to convert special characters to URL-encoded format
    const encodedString = encodeURIComponent(inputString);
    return encodedString;
}
exports.convertSpecialCharsToUnicode = convertSpecialCharsToUnicode;
