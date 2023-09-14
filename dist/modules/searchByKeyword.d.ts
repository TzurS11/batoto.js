import { sources, langOriginal, langTransalted, sortOrder, status, axiosProxy } from "./types";
type options = {
    /**
     * Set up a rotating proxy to prevent IP blocking when you have many requests to bato.to
     */
    proxy?: axiosProxy;
    /**
     * if there is more than one page for this search you can change the page here.
     */
    page?: number;
    /**
     * incase https://bato.to goes down you can chagne the domain here. lits of mirror links https://rentry.co/batoto/raw
     */
    baseURL?: sources;
    /**
     * original language of the manga
     */
    originalLanguage?: langOriginal[];
    /**
     * the language the manga is currently in. the translated version
     */
    translatedLanguage?: langTransalted[];
    /**
     * sort results in a different way
     */
    sort?: sortOrder;
    /**
     * the status of the manga not related to bato.to
     */
    workStatus?: status;
    /**
     * the upload status of the manga related to bato.to
     */
    uploadStatus?: status;
};
/**
 * Get list of mangas from a keyword. Example: Kimetsu no Yaiba, Demon Slayer
 * @param keyword The text value.
 * @param options Options for getting the information.
 */
export declare function searchByKeyword(keyword: string, options?: options): Promise<{
    /**
     * the search url.
     */
    url: string;
    /**
     * check if the search is valid and successful. always check if that is true before using results or pages
     */
    valid: boolean;
    /**
     * list of mangas found. if valid is false eveything will be empty
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
    /**
     * how many pages are in this search
     */
    pages: number;
}>;
export {};
