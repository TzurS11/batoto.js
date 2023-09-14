import { axiosProxy, sources } from "./types";
type options = {
    /**
     * incase https://bato.to goes down you can chagne the domain here. lits of mirror links https://rentry.co/batoto/raw
     */
    baseURL?: sources;
    /**
     * converts all special chars so you can handle it as a url.
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
/**
 * Get all images from a chapter by id.
 * @param chapterID The id of the chapter. get chapter id from getByID
 * @param options Options for getting the information
 */
export declare function getChapterByID(chapterID: string, options?: options): Promise<{
    url: string;
    valid: boolean;
    pages: string[];
}>;
export {};
