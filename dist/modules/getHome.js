"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHome = void 0;
const utils_1 = require("./utils");
/**
 * get all the the content in the home page.
 * @param options
 * @returns
 */
async function getHome(options = {
    baseURL: "https://bato.to",
    proxy: {
        auth: { password: undefined, username: undefined },
        host: undefined,
        port: undefined,
        protocol: undefined,
    },
}) {
    const baseURL = options.baseURL || "https://bato.to";
    try {
        let document = await (0, utils_1.fetchHTML)(`${baseURL}/v3x`, options.proxy);
        if (document == null) {
            return {
                /**
                 * the url used to get the information.
                 */
                url: `${baseURL}/v3x`,
                /**
                 * check if the scrape is valid and successful. always check if that is true before using popularUpdates or latestReleases
                 */
                valid: false,
                /**
                 * The mangas in the popular updates section. if valid is false eveything will be empty
                 */
                popularUpdates: [],
                /**
                 * The mangas in the latest releases section. if valid is false eveything will be empty
                 */
                latestReleases: [],
            };
        }
        let popularUpdates = [];
        let popularUpdatesWrapper = document.querySelector("#app-wrapper > main > div:nth-child(3) > astro-island > div > div:nth-child(2) > astro-slot > div");
        let popularUpdatesDivs = (0, utils_1.querySelectorAllRegex)(popularUpdatesWrapper, "data-hk", /0-0-\d*-0/);
        for (let i = 0; i < popularUpdatesDivs.length; i++) {
            const currentDiv = popularUpdatesDivs[i];
            const currentDiv_img = currentDiv.getElementsByTagName("img").item(0);
            if (currentDiv_img == null)
                continue;
            const parent_currentDiv_img = currentDiv_img.parentElement;
            let lastChapterAnchor = currentDiv
                .getElementsByClassName("link link-hover text-xs text-white line-clamp-1 visited:text-accent")
                .item(0);
            popularUpdates.push({
                poster: currentDiv_img.src || "",
                title: currentDiv_img.alt || "",
                id: parent_currentDiv_img.href.replace("/title/", "") || "",
                lastChapter: {
                    name: lastChapterAnchor.innerHTML,
                    id: lastChapterAnchor.href.replace("/title/", "") || "",
                },
            });
        }
        let latestReleases = [];
        let latestReleasesWrapper = document.querySelector("#app-wrapper > main > div:nth-child(4) > astro-island > div > div.space-y-5 > astro-slot > div");
        let latestReleasesDivs = (0, utils_1.querySelectorAllRegex)(latestReleasesWrapper, "data-hk", /0-0-\d*-0/);
        for (let i = 0; i < latestReleasesDivs.length; i++) {
            const currentDiv = latestReleasesDivs[i];
            const currentDiv_img = currentDiv.getElementsByTagName("img").item(0);
            if (currentDiv_img == null)
                continue;
            const parent_currentDiv_img = currentDiv_img.parentElement;
            let lastChapterAnchor = currentDiv
                .getElementsByClassName("link-hover link-primary visited:link-accent")
                .item(0);
            let lastChapter;
            if (lastChapterAnchor == undefined) {
                lastChapter = { id: "", name: "" };
            }
            else {
                lastChapter = {
                    name: lastChapterAnchor.getElementsByTagName("span").item(0).innerHTML ||
                        "",
                    id: lastChapterAnchor.href.replace("/title/", "") || "",
                };
            }
            const genres = [];
            let chapterSpans = (0, utils_1.querySelectorAllRegex)(currentDiv, "data-hk", /0-0-\d*-4-2-\d*-3-0/);
            for (let j = 0; j < chapterSpans.length; j++) {
                const currentSpan = chapterSpans[j];
                genres.push(currentSpan.innerHTML);
            }
            latestReleases.push({
                poster: currentDiv_img.src || "",
                title: currentDiv_img.alt || "",
                id: parent_currentDiv_img.href.replace("/title/", "") || "",
                mature: (0, utils_1.isMature)(genres),
                genres: genres,
                lastChapter: lastChapter,
            });
        }
        return {
            /**
             * the url used to get the information.
             */
            url: `${baseURL}/v3x`,
            /**
             * check if the scrape is valid and successful. always check if that is true before using popularUpdates or latestReleases
             */
            valid: true,
            /**
             * The mangas in the popular updates section. if valid is false eveything will be empty
             */
            popularUpdates: popularUpdates,
            /**
             * The mangas in the latest releases section. if valid is false eveything will be empty
             */
            latestReleases: latestReleases,
        };
    }
    catch (error) {
        console.error(error);
        return {
            /**
             * the url used to get the information.
             */
            url: `${baseURL}/v3x`,
            /**
             * check if the scrape is valid and successful. always check if that is true before using popularUpdates or latestReleases
             */
            valid: false,
            /**
             * The mangas in the popular updates section. if valid is false eveything will be empty
             */
            popularUpdates: [],
            /**
             * The mangas in the latest releases section. if valid is false eveything will be empty
             */
            latestReleases: [],
        };
    }
}
exports.getHome = getHome;
// 0-0-0-4-2-1-3-0
// 0-0-0-4-2-0-3-0
// 0-0-0-4-2-2-3-0
// 0-0-1-4-2-1-3-0
// 0-0-1-4-2-2-3-0
// 0-0-2-4-2-0-3-0
// 0-0-2-4-2-2-3-0
// 0-0-2-4-2-1-3-0
//
