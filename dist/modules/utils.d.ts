/**
 * get the html of the url as a document.
 * @param url The website you want to fetch
 * @returns
 */
export declare function fetchHTML(url: string): Promise<Document | null>;
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
export type sources = "https://bato.to" | "https://wto.to" | "https://mto.to" | "https://dto.to" | "https://hto.to" | "https://batotoo.com" | "https://battwo.com" | "https://batotwo.com" | "https://comiko.net" | "https://mangatoto.com" | "https://mangatoto.net" | "https://mangatoto.org" | "https://comiko.org" | "https://batocomic.com" | "https://batocomic.net" | "https://batocomic.org" | "https://readtoto.com" | "https://readtoto.net" | "https://readtoto.org" | "https://xbato.com" | "https://xbato.net" | "https://xbato.org" | "https://zbato.com" | "https://zbato.net" | "https://zbato.org";
