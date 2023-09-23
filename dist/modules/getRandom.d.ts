import { axiosProxy, sources } from "./types";
type options = {
    /**
     * incase https://bato.to goes down you can change the domain here. List of mirror links https://rentry.co/batoto/raw
     */
    baseURL?: sources;
    /**
     * Set up a rotating proxy to prevent IP blocking when you have many requests to bato.to
     */
    proxy?: axiosProxy;
};
type Result = {
    id: string;
    title: {
        original: string;
        synonyms: string[];
    };
    authors: string[];
    poster: string;
    genres: string[];
    mature: boolean;
};
type ValidResult = {
    /**
     * the fetch url
     */
    url: string;
    /**
     * check if the fetch is valid and successful. always check if that is true before using results
     */
    valid: true;
    /**
     * the mangas found.
     */
    results: Result[];
};
type InvalidResult = {
    /**
     * the fetch url
     */
    url: string;
    /**
     * check if the fetch is valid and successful. always check if that is true before using results
     */
    valid: false;
    /**
   * ```js
   * THIS MIGHT BE INVALID
   * if (valid == false) return;
   * ```
   */
    results?: never;
};
/**
 * Get random mangas
 * @param options Options for getting the information.
 * @returns
 */
export declare function getRandom(options?: options): Promise<ValidResult | InvalidResult>;
export {};
