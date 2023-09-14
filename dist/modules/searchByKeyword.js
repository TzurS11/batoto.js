"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchByKeyword = void 0;
const utils_1 = require("./utils");
/**
 * Get list of mangas from a keyword. Example: Kimetsu no Yaiba, Demon Slayer
 * @param keyword The text value.
 * @param options Options for getting the information.
 */
async function searchByKeyword(keyword, options = {
    proxy: {
        auth: { password: undefined, username: undefined },
        host: undefined,
        port: undefined,
        protocol: undefined,
    },
    baseURL: "https://bato.to",
    page: 1,
    originalLanguage: [],
    translatedLanguage: ["ja", "ko", "zh", "en"],
    sort: "field_score",
    workStatus: "",
    uploadStatus: "",
}) {
    const baseURL = options.baseURL || "https://bato.to";
    const page = options.page || 1;
    const orig = (0, utils_1.convertLangArrayToString)(options.originalLanguage || []);
    const lang = (0, utils_1.convertLangArrayToString)(options.translatedLanguage || ["ja", "ko", "zh", "en"]);
    const sort = options.sort || "field_score";
    const workStatus = options.workStatus || "";
    const uploadStatus = options.uploadStatus || "";
    let uri = `${baseURL}/v3x-search?word=${keyword}&orig=${orig}&lang=${lang}&sort=${sort}&page=${page}&status=${workStatus}&upload=${uploadStatus}`;
    try {
        const list = [];
        let document = await (0, utils_1.fetchHTML)(uri, options.proxy);
        if (document == null) {
            return {
                /**
                 * the search url.
                 */
                url: uri,
                /**
                 * check if the search is valid and successful. always check if that is true before using results or pages
                 */
                valid: false,
                /**
                 * list of mangas found. if valid is false eveything will be empty
                 */
                results: [],
                /**
                 * how many pages are in this search
                 */
                pages: 0,
            };
        }
        const matchingElements = (0, utils_1.querySelectorAllRegex)(document.querySelector('[data-hk="0-0-2"]'), "data-hk", /0-0-3-\d*-0/);
        for (let i = 0; i < matchingElements.length; i++) {
            const posterElement = (0, utils_1.querySelectorAllRegex)(matchingElements[i], "data-hk", /0-0-3-\d*-1-1-0/)[0];
            const poster = posterElement.src;
            const id = posterElement.parentElement.href.split("/")[2];
            const titleOriginal = posterElement.title;
            const titleSynonyms = (0, utils_1.querySelectorAllRegex)(matchingElements[i], "data-hk", /0-0-3-\d*-3-1-\d*-0/);
            let currentSyns = [];
            for (let i = 0; i < titleSynonyms.length; i++) {
                let currentSpan = titleSynonyms[i];
                if (currentSpan.innerHTML != " / ")
                    currentSyns.push(currentSpan.innerHTML
                        .replace(/<span class="highlight-text">/g, "")
                        .replace(/<\/span>/g, ""));
            }
            const genres = (0, utils_1.querySelectorAllRegex)(matchingElements[i], "data-hk", /0-0-3-\d*-6-2-\d*-3-0/);
            let currentGenres = [];
            for (let i = 0; i < genres.length; i++) {
                let currentSpan = genres[i];
                currentGenres.push(currentSpan.innerHTML
                    .replace(/<span class="highlight-text">/g, "")
                    .replace(/<\/span>/g, ""));
            }
            const authors = (0, utils_1.querySelectorAllRegex)(matchingElements[i], "data-hk", /0-0-3-\d*-4-1-\d*-0/);
            let currentAuthors = [];
            for (let i = 0; i < authors.length; i++) {
                let currentSpan = authors[i];
                if (currentSpan.innerHTML != " / ")
                    currentAuthors.push(currentSpan.innerHTML
                        .replace(/<span class="highlight-text">/g, "")
                        .replace(/<\/span>/g, ""));
            }
            let mature = false;
            if ((0, utils_1.isMature)(currentGenres))
                mature = true;
            list.push({
                id: id,
                title: { original: titleOriginal, synonyms: currentSyns },
                authors: currentAuthors,
                poster: poster == "/public-assets/img/no-image.png"
                    ? `${baseURL}/public-assets/img/no-image.png`
                    : String(poster),
                genres: currentGenres,
                mature: mature,
            });
        }
        const pages = document.querySelector('[data-hk="0-0-4-0-0"]');
        //0-0-4-0-1-3-2-0
        //0-0-4-0-1-5-2-0
        let numOfPages = 0;
        if (pages != null) {
            let pageAs = (0, utils_1.querySelectorAllRegex)(pages, "data-hk", /0-0-4-0-1-\d*-2-0/);
            numOfPages = Number(pageAs[pageAs.length - 1].innerHTML);
        }
        return {
            /**
             * the search url.
             */
            url: uri,
            /**
             * check if the search is valid and successful. always check if that is true before using results or pages
             */
            valid: document.querySelector("#app-wrapper > main > div:nth-child(3) > button") == null,
            /**
             * list of mangas found. if valid is false eveything will be empty
             */
            results: list,
            /**
             * how many pages are in this search
             */
            pages: numOfPages,
        };
    }
    catch (e) {
        console.error(e);
        return {
            /**
             * the search url.
             */
            url: uri,
            /**
             * check if the search is valid and successful. always check if that is true before using results or pages
             */
            valid: false,
            /**
             * list of mangas found. if valid is false eveything will be empty
             */
            results: [],
            /**
             * how many pages are in this search
             */
            pages: 0,
        };
    }
}
exports.searchByKeyword = searchByKeyword;
