import { axiosProxy, sources } from "./types";
type PopularUpdate = {
    poster: string;
    title: string;
    id: string;
    lastChapter: {
        name: string;
        id: string;
    };
};
type LatestRelease = {
    poster: string;
    title: string;
    id: string;
    genres: string[];
    mature: boolean;
    lastChapter: {
        name: string;
        id: string;
    };
};
type ValidResult = {
    /**
     * the url used to get the information.
     */
    url: string;
    /**
     * check if the scrape is valid and successful. always check if that is true before using popularUpdates or latestReleases
     */
    valid: true;
    /**
     * The mangas in the popular updates section.
     */
    popularUpdates: PopularUpdate[];
    /**
     * The mangas in the latest releases section.
     */
    latestReleases: LatestRelease[];
};
type InvalidResult = {
    /**
     * the url used to get the information.
     */
    url: string;
    /**
     * check if the scrape is valid and successful. always check if that is true before using popularUpdates or latestReleases.
     */
    valid: false;
    /**
   * ```js
   * THIS MIGHT BE INVALID
   * if (valid == false) return;
   * ```
   */
    popularUpdates?: never;
    /**
   * ```js
   * THIS MIGHT BE INVALID
   * if (valid == false) return;
   * ```
   */
    latestReleases?: never;
};
type options = {
    /**
     * incase https://bato.to goes down you can chagne the domain here. lits of mirror links https://rentry.co/batoto/raw
     */
    baseURL?: sources;
    /**
     * Set up a rotating proxy to prevent IP blocking when you have many requests to bato.to
     */
    proxy?: axiosProxy;
};
/**
 * get all the the content in the home page.
 * @param options
 * @returns
 */
export declare function getHome(options?: options): Promise<ValidResult | InvalidResult>;
export {};
