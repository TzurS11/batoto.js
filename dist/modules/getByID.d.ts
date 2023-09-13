import { axiosProxy, sources } from "./types";
type options = {
    baseURL?: sources;
    noChapters?: boolean;
    proxy?: axiosProxy;
};
/**
 * Get more information about a manga based on its id. title, author, poster, genres, chapters, description, read direction, status, score. the id can be found with searchByKeyword.
 * @param id the id of the manga.
 * @param options Options for getting the information
 */
export declare function getByID(id: string, options?: options): Promise<{
    url: string;
    valid: boolean;
    id: string;
    title: string;
    languages: string;
    description: string;
    authors: string[];
    artists: string[];
    poster: string;
    genres: string;
    score: number;
    status: string;
    readDirection: string;
    mature: boolean;
    chapters: {
        name: string;
        id: string;
        timestamp: number;
    }[];
} | {
    valid: boolean;
    url: string;
    id: string;
    title: {
        original: string;
        synonyms: string[];
    };
    languages: {
        original: string;
        translated: string;
    };
    description: string;
    authors: string[];
    artists: string[];
    poster: string;
    genres: string[];
    score: number;
    status: string;
    readDirection: string;
    mature: boolean;
    chapters: {
        name: string;
        id: string;
        timestamp: number;
    }[];
}>;
export {};
