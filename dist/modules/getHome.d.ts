import { axiosProxy, sources } from "./types";
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
export declare function getHome(options?: options): Promise<{
    /**
     * the url used to get the information.
     */
    url: string;
    /**
     * check if the scrape is valid and successful. always check if that is true before using popularUpdates or latestReleases
     */
    valid: boolean;
    /**
     * The mangas in the popular updates section. if valid is false eveything will be empty
     */
    popularUpdates: {
        poster: string;
        title: string;
        id: string;
        lastChapter: {
            name: string;
            id: string;
        };
    }[];
    /**
     * The mangas in the latest releases section. if valid is false eveything will be empty
     */
    latestReleases: {
        poster: string;
        title: string;
        id: string;
        genres: string[];
        mature: boolean;
        lastChapter: {
            name: string;
            id: string;
        };
    }[];
}>;
export {};
