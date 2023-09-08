"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchByKeyword = void 0;
const utils_1 = require("./utils");
/**
 * Get list of mangas from a keyword. Example: Kimetsu no Yaiba, Demon Slayer
 * @param keyword The text value.
 * @param options Options for getting the information.
 */
async function searchByKeyword(keyword, options = { baseURL: "https://bato.to", page: 1 }) {
    const baseURL = options.baseURL || "https://bato.to";
    const page = options.page || 1;
    try {
        const list = [];
        let document = await (0, utils_1.fetchHTML)(`${baseURL}/v3x-search?word=${keyword}&lang=ja,ko,zh,en&sort=field_follow&page=${page}`);
        if (document == null) {
            return { valid: false };
        }
        document.getElementsByTagName("img");
        const matchingElements = (0, utils_1.querySelectorAllRegex)(document.querySelector('[data-hk="0-0-2"]'), "data-hk", /0-0-3-\d*-0/);
        const pages = document.querySelector('[data-hk="0-0-4-0-0"]');
        for (let i = 0; i < matchingElements.length; i++) {
            let poster = (0, utils_1.querySelectorAllRegex)(matchingElements[i], "data-hk", /0-0-3-\d*-1-1-0/)[0].src;
            const id = (0, utils_1.querySelectorAllRegex)(matchingElements[i], "data-hk", /0-0-3-\d*-1-1-0/)[0].parentElement.href.split("/")[2];
            const titleOriginal = (0, utils_1.querySelectorAllRegex)(matchingElements[i], "data-hk", /0-0-3-\d*-2-2-0/)[0]
                .innerHTML.replace(/<span class="highlight-text">/g, "")
                .replace(/<\/span>/g, "");
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
        let numOfPages = 0;
        if (pages != null) {
            let pageAs = (0, utils_1.querySelectorAllRegex)(pages, "data-hk", /0-0-4-0-1-\d*-2-0/);
            numOfPages = Number(pageAs[pageAs.length - 1].innerHTML);
        }
        return {
            url: `${baseURL}/v3x-search?word=${keyword}&orig=&lang=ja,ko,zh,en&sort=field_follow&page=${page}`,
            valid: document.querySelector("#app-wrapper > main > div:nth-child(3) > button") == null,
            results: list,
            pages: numOfPages,
        };
    }
    catch (e) {
        console.error(e);
        return {
            url: `${baseURL}/v3x-search?word=${keyword}&orig=&lang=ja,ko,zh,en&sort=field_follow&page=${page}`,
            valid: false,
        };
    }
}
exports.searchByKeyword = searchByKeyword;
searchByKeyword("jinx");
// module.exports = searchByKeyword;
