import { sources } from "./utils";
type options = {
    page?: number;
    baseURL?: sources;
};
/**
 * Get list of mangas from a keyword. Example: Kimetsu no Yaiba, Demon Slayer
 * @param keyword The text value.
 * @param options Options for getting the information.
 */
export declare function searchByKeyword(keyword: string, options?: options): Promise<{
    valid: boolean;
    url?: undefined;
    results?: undefined;
    pages?: undefined;
} | {
    url: string;
    valid: boolean;
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
    pages: number;
} | {
    url: string;
    valid: boolean;
    results?: undefined;
    pages?: undefined;
}>;
export {};
