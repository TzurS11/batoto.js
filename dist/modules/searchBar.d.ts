import { sources, axiosProxy } from "./types";
import { MangaInfo, InvalidMangaInfo, GetByIDoptions } from "./getByID";
type Result = {
    title: string;
    id: string;
    poster: string;
    authors: string[];
    /**
     * Get more information that is not available just on the search screen.
     */
    getAdditionalInfo: (additionalOptions?: GetByIDoptions) => Promise<MangaInfo | InvalidMangaInfo>;
};
type ValidSearchBar = {
    /**
     * the fetch url used to get the information.
     */
    url: string;
    /**
     * check if the search is valid and successful. always check if that is true before using results
     */
    valid: true;
    /**
     * results from typing the term. just like typing in the search bar in bato.to.
     */
    results: Result[];
};
type InvalidSearchBar = {
    /**
     * the fetch url used to get the information.
     */
    url: string;
    /**
     * check if the search is valid and successful. always check if that is true before using results
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
/**
 * Use this function to get a list of mangas found by the results. This api endpoint might be better when calling a lot of times because it is being used in the original website everytime the user is editing the search term
 * @param term The term used to search the manga.
 * @param options Options for getting the information.
 */
export declare function searchBar(term: string, options?: options): Promise<ValidSearchBar | InvalidSearchBar>;
export {};
