import { sources } from "./types";
type options = {
    baseURL?: sources;
};
/**
 * Get random mangas
 * @param options Options for getting the information.
 * @returns
 */
export declare function getRandom(options?: options): Promise<{
    url: string;
    valid: boolean;
    results: any[];
} | {
    url: string;
    valid: boolean;
    results?: undefined;
}>;
export {};
