"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHome = void 0;
const utils_1 = require("./utils");
/**
 * get all the the content in the home page.
 * @param options
 * @returns
 */
async function getHome(options = { baseURL: "https://bato.to" }) {
    const baseURL = options.baseURL || "https://bato.to";
    try {
        let document = await (0, utils_1.fetchHTML)(`${baseURL}/v3x`);
        if (document == null) {
            return {
                url: `${baseURL}/v3x`,
                valid: false,
                popularUpdates: [],
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
            latestReleases.push({
                poster: currentDiv_img.src || "",
                title: currentDiv_img.alt || "",
                id: parent_currentDiv_img.href.replace("/title/", "") || "",
                mature: true,
                genres: [],
                lastChapter: lastChapter,
            });
        }
        return {
            url: `${baseURL}/v3x`,
            valid: true,
            popularUpdates: popularUpdates,
            latestReleases: latestReleases,
        };
    }
    catch (error) {
        console.error(error);
        return {
            url: `${baseURL}/v3x`,
            valid: false,
            popularUpdates: [],
            latestReleases: [],
        };
    }
}
exports.getHome = getHome;
