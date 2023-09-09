import { JSDOM } from "jsdom";
import axios from "axios";

/**
 * get the html of the url as a document.
 * @param url The website you want to fetch
 * @returns
 */
export async function fetchHTML(url: string): Promise<Document | null> {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    return document;
  } catch {
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

export type sources =
  | "https://bato.to"
  | "https://wto.to"
  | "https://mto.to"
  | "https://dto.to"
  | "https://hto.to"
  | "https://batotoo.com"
  | "https://battwo.com"
  | "https://batotwo.com"
  | "https://comiko.net"
  | "https://mangatoto.com"
  | "https://mangatoto.net"
  | "https://mangatoto.org"
  | "https://comiko.org"
  | "https://batocomic.com"
  | "https://batocomic.net"
  | "https://batocomic.org"
  | "https://readtoto.com"
  | "https://readtoto.net"
  | "https://readtoto.org"
  | "https://xbato.com"
  | "https://xbato.net"
  | "https://xbato.org"
  | "https://zbato.com"
  | "https://zbato.net"
  | "https://zbato.org";

// lits of mirror links https://rentry.co/batoto/raw
