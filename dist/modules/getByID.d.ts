import { axiosProxy, sources } from "./types";
type options = {
    /**
     * incase https://bato.to goes down you can chagne the domain here. lits of mirror links https://rentry.co/batoto/raw
     */
    baseURL?: sources;
    /**
     * does not retrive chapters. can speed up return time.
     */
    noChapters?: boolean;
    /**
     * Set up a rotating proxy to prevent IP blocking when you have many requests to bato.to
     */
    proxy?: axiosProxy;
};
/**
 * Get more information about a manga based on its id. title, author, poster, genres, chapters, description, read direction, status, score. the id can be found with searchByKeyword.
 * @param id the id of the manga.
 * @param options Options for getting the information
 */
export declare function getByID(id: string, options?: options): Promise<{
    /**
     * the url that uas used to scrape
     */
    url: string;
    /**
     * check if the scrape is valid and successful. always check if that is true before using any of the results
     */
    valid: boolean;
    /**
     * the id of the manga. if valid is false the array will be empty
     */
    id: string;
    /**
     * the title of the manga. if valid is false the array will be empty
     */
    title: {
        original: string;
        synonyms: string[];
    };
    /**
     * the language of the manga. translated is the language of the manga that was scraped. if valid is false the array will be empty
     */
    languages: {
        original: string;
        translated: string;
    };
    /**
     * the description of the manga. if valid is false the array will be empty
     */
    description: string;
    /**
     * the authors. if valid is false the array will be empty
     */
    authors: string[];
    /**
     * the artists. if valid is false the array will be empty
     */
    artists: string[];
    /**
     * image address of the poster. if valid is false the array will be empty
     */
    poster: string;
    /**
     * the generes of the manga. if valid is false the array will be empty
     */
    genres: string;
    /**
     * the score on bato.to. if valid is false the array will be empty
     */
    score: number;
    /**
     * the status of the manga. if valid is false the array will be empty
     */
    status: string;
    /**
     * read direction of the manga. left to right, right to left, top to bottom. if valid is false the array will be empty
     */
    readDirection: string;
    /**
     * is the manga 18+. if valid is false the array will be empty
     */
    mature: boolean;
    /**
     * list of chapters. if disabled in options the array will be empty. if valid is false the array will be empty
     */
    chapters: {
        name: string;
        id: string;
        timestamp: number;
    }[];
} | {
    /**
     * the url that uas used to scrape
     */
    url: string;
    /**
     * check if the scrape is valid and successful. always check if that is true before using any of the results
     */
    valid: boolean;
    /**
     * the id of the manga. if valid is false the array will be empty
     */
    id: string;
    /**
     * the title of the manga. if valid is false the array will be empty
     */
    title: {
        original: string;
        synonyms: string[];
    };
    /**
     * the language of the manga. translated is the language of the manga that was scraped. if valid is false the array will be empty
     */
    languages: {
        original: string;
        translated: string;
    };
    /**
     * the description of the manga. if valid is false the array will be empty
     */
    description: string;
    /**
     * the authors. if valid is false the array will be empty
     */
    authors: string[];
    /**
     * the artists. if valid is false the array will be empty
     */
    artists: string[];
    /**
     * image address of the poster. if valid is false the array will be empty
     */
    poster: string;
    /**
     * the generes of the manga. if valid is false the array will be empty
     */
    genres: string[];
    /**
     * the score on bato.to. if valid is false the array will be empty
     */
    score: number;
    /**
     * the status of the manga. if valid is false the array will be empty
     */
    status: string;
    /**
     * read direction of the manga. left to right, right to left, top to bottom. if valid is false the array will be empty
     */
    readDirection: string;
    /**
     * is the manga 18+. if valid is false the array will be empty
     */
    mature: boolean;
    /**
     * list of chapters. if disabled in options the array will be empty. if valid is false the array will be empty
     */
    chapters: {
        name: string;
        id: string;
        timestamp: number;
    }[];
}>;
export {};
