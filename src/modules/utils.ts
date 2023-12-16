import { JSDOM } from "jsdom";
import axios, { AxiosResponse } from "axios";
import { axiosProxy, langOriginal, langTransalted } from "./types";
import * as url from "url";

/**
 * get the html of the url as a document.
 * @param url The website you want to fetch
 * @returns
 */
export async function fetchHTML(
  url: string,
  proxy?: axiosProxy
): Promise<Document | null> {
  url.replace("https", "http");
  try {
    let response: AxiosResponse<any, any>;
    if (
      proxy == undefined ||
      proxy.host == undefined ||
      proxy.port == undefined
    ) {
      response = await axios.get(url);
    } else {
      console.log(proxy);
      response = await axios.get(url, { proxy: proxy });
    }

    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    return document;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}
/**
 * regex search an attribute inside a document.
 * @returns
 */
export function querySelectorAllRegex(
  document: Document | Element,
  attribute: string,
  regex: RegExp
): Element[] {
  const regexPattern = regex;

  // Select all elements with the attribute 'data-custom-attribute'
  const elementsWithAttribute = document.querySelectorAll(`[${attribute}]`);

  // Filter elements based on the regular expression pattern
  const matchingElements = Array.from(elementsWithAttribute).filter(
    (element) => {
      const attributeValue = element.getAttribute(attribute) || "";
      return regexPattern.test(attributeValue);
    }
  );
  return matchingElements;
}

/**
 * Check if the manga is mature by genres.
 * @param genres
 */
export function isMature(genres: string[]): boolean {
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
    if (NSFWgenres.includes(genre)) return true;
  }
  return false;
}

export function convertLangArrayToString(
  langArr: langOriginal[] | langTransalted[]
) {
  let langString = "";
  langArr = [...new Set(langArr)];
  for (let i = 0; i < langArr.length; i++) {
    if (i == langArr.length - 1) {
      langString = langString + langArr[i];
    } else {
      langString = langString + langArr[i] + ",";
    }
  }
  return langString;
}

/**
 * check if an image is still valid. can be tested on one of the pages in a chapter to check if the image is expired
 * @param url the address of the image.
 */
export function isPageValid(urlString: string): boolean {
  const parsedUrl = url.parse(urlString, true);
  const expParam = parsedUrl.query.exp as string | undefined;

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

export function convertSpecialCharsToUnicode(inputString: string) {
  // Use encodeURIComponent to convert special characters to URL-encoded format
  const encodedString = encodeURIComponent(inputString);
  return encodedString;
}

export function convertUnicodeToSpecialChars(inputString: string) {
  const decodedString = decodeURIComponent(inputString);
  return decodedString;
}
