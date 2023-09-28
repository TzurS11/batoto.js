import { axiosProxy, sources } from "./types";
import { ChapterResult, InvalidChapterResult, getChapterByIDoptions } from "./getChapterByID";
export type GetByIDoptions = {
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
type Results = {
    /**
     * the id of the manga.
     */
    id: string;
    /**
     * the title of the manga.
     */
    title: {
        original: string;
        synonyms: string[];
    };
    /**
     * the language of the manga. translated is the language of the manga that was scraped.
     */
    languages: {
        original: string;
        translated: string;
    };
    /**
     * the description of the manga.
     */
    description: string;
    /**
     * the authors.
     */
    authors: string[];
    /**
     * the artists.
     */
    artists: string[];
    /**
     * image address of the poster.
     */
    poster: string;
    /**
     * the generes of the manga.
     */
    genres: string[];
    /**
     * the score on bato.to.
     */
    score: number;
    /**
     * the status of the manga.
     */
    status: string;
    /**
     * read direction of the manga. left to right, right to left, top to bottom.
     */
    readDirection: string;
    /**
     * is the manga 18+.
     */
    mature: boolean;
    /**
     * list of chapters. if disabled in options the array will be empty.
     */
    chapters: {
        name: string;
        id: string;
        timestamp: number;
        /**
         * Get the chapter.
         */
        getChapter: (additionalOptions?: getChapterByIDoptions) => Promise<ChapterResult | InvalidChapterResult>;
    }[];
};
export type MangaInfo = {
    /**
     * the url used to get the information.
     */
    url: string;
    /**
     * check if the scrape is valid and successful. always check if that is true before using results.
     */
    valid: true;
    /**
     * The results found with this manga id.
     */
    results: Results;
};
export type InvalidMangaInfo = {
    /**
     * the url used to get the information.
     */
    url: string;
    /**
     * check if the scrape is valid and successful. always check if that is true before using results.
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
 * Get more information about a manga based on its id. title, author, poster, genres, chapters, description, read direction, status, score. the id can be found with searchByKeyword.
 * @param id the id of the manga.
 * @param options Options for getting the information
 */
export declare function getByID(id: string, options?: GetByIDoptions): Promise<MangaInfo | InvalidMangaInfo>;
export {};
