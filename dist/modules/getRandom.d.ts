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
 * Get random mangas
 * @param options Options for getting the information.
 * @returns
 */
export declare function getRandom(options?: options): Promise<{
    /**
     * the fetch url
     */
    url: string;
    /**
     * check if the fetch is valid and successful. always check if that is true before using results
     */
    valid: boolean;
    /**
     * the mangas found. if valid is false eveything will be empty
     */
    results: {
        id: string;
        title: {
            original: string;
            synonyms: string[];
        };
        authors: string[];
        poster: string;
        genres: string[];
        mature: boolean;
    }[];
}>;
export {};
