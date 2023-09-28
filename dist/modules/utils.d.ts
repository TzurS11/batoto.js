import { axiosProxy, langOriginal, langTransalted } from "./types";
/**
 * get the html of the url as a document.
 * @param url The website you want to fetch
 * @returns
 */
export declare function fetchHTML(url: string, proxy: axiosProxy): Promise<Document | null>;
/**
 * regex search an attribute inside a document.
 * @returns
 */
export declare function querySelectorAllRegex(document: Document | Element, attribute: string, regex: RegExp): Element[];
/**
 * Check if the manga is mature by genres.
 * @param genres
 */
export declare function isMature(genres: string[]): boolean;
export declare function convertLangArrayToString(langArr: langOriginal[] | langTransalted[]): string;
/**
 * check if an image is still valid. can be tested on one of the pages in a chapter to check if the image is expired
 * @param url the address of the image.
 */
export declare function isPageValid(urlString: string): boolean;
export declare function convertSpecialCharsToUnicode(inputString: string): string;
export declare function convertUnicodeToSpecialChars(inputString: string): string;
