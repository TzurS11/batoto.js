import { sources } from "./utils";
type options = {
    baseURL: sources;
};
/**
 * Get more information about a manga based on its id. title, author, poster, genres, chapters, description, read direction, status, score. the id can be found with searchByKeyword.
 * @param id the id of the manga.
 * @param  options Options for getting the information
 */
export declare function getByID(id: string, options?: options): Promise<{
    valid: boolean;
    url: string;
    title?: undefined;
    poster?: undefined;
    authors?: undefined;
    genres?: undefined;
    chapters?: undefined;
    description?: undefined;
    readDirection?: undefined;
    status?: undefined;
    score?: undefined;
    mature?: undefined;
} | {
    url: string;
    valid: boolean;
    title: {
        original: string;
        synonyms: string[];
    };
    poster: string;
    authors: string[];
    genres: string[];
    chapters: any[];
    description: string;
    readDirection: string;
    status: string;
    score: string;
    mature: boolean;
}>;
export {};
