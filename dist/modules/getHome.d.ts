import { sources } from "./types";
type options = {
    baseURL?: sources;
};
/**
 * get all the the content in the home page.
 * @param options
 * @returns
 */
export declare function getHome(options?: options): Promise<{
    url: string;
    valid: boolean;
    popularUpdates: {
        poster: string;
        title: string;
        id: string;
        lastChapter: {
            name: string;
            id: string;
        };
    }[];
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
