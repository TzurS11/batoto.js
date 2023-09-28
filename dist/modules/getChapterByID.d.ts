import { axiosProxy, sources } from "./types";
import { GetByIDoptions, MangaInfo, InvalidMangaInfo } from "./getByID";
export type getChapterByIDoptions = {
    /**
     * incase https://bato.to goes down you can chagne the domain here. lits of mirror links https://rentry.co/batoto/raw
     */
    baseURL?: sources;
    /**
     * converts all special chars so you can handle it as a url.
     * if you need to pass the image in a url then it will cause problems with special chars
     */
    unicode?: boolean;
    /**
     * cache the addresses of the images. this takes care of expiration of the images. images that are expired will be replaced with new data.
     */
    cache?: boolean;
    /**
     * Set up a rotating proxy to prevent IP blocking when you have many requests to bato.to
     */
    proxy?: axiosProxy;
};
export type ChapterResult = {
    /**
     * the url used to get the chapter.
     */
    url: string;
    /**
     * check if the scrape is valid and successful. always check if that is true before using pages or downloadZip
     */
    valid: true;
    /**
     * List of image addresses.
     */
    pages: string[];
    /**
     * Export all the pages to a zip file. can be used forever since it wont become expired.
     * @param path the path to download the zip to. if not specified: ./downloads/{chapterID}
     */
    downloadZip: (path?: string) => Promise<void>;
    /**
     * Get more information that is not available just on the chapter page.
     */
    getAdditionalInfo: (additionalOptions?: GetByIDoptions) => Promise<MangaInfo | InvalidMangaInfo>;
};
export type InvalidChapterResult = {
    /**
     * the url used to get the chapter.
     */
    url: string;
    /**
     * check if the scrape is valid and successful. always check if that is true before using pages or downloadZip
     */
    valid: false;
    /**
     * ```js
     * THIS MIGHT BE INVALID
     * if (valid == false) return;
     * ```
     */
    pages?: never;
    /**
     * ```js
     * THIS MIGHT BE INVALID
     * if (valid == false) return;
     * ```
     */
    downloadZip?: never;
    /**
     * ```js
     * THIS MIGHT BE INVALID
     * if (valid == false) return;
     * ```
     */
    getAdditionalInfo?: never;
};
/**
 * Get all images from a chapter by id.
 * @param chapterID The id of the chapter. get chapter id from getByID
 * @param options Options for getting the information
 */
export declare function getChapterByID(chapterID: string, options?: getChapterByIDoptions): Promise<ChapterResult | InvalidChapterResult>;
