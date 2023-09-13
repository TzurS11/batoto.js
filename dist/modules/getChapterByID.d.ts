import { sources } from "./types";
type options = {
    baseURL?: sources;
    unicode?: boolean;
    cache?: boolean;
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
