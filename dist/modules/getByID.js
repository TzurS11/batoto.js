"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByID = void 0;
const utils_1 = require("./utils");
/**
 * Get more information about a manga based on its id. title, author, poster, genres, chapters, description, read direction, status, score. the id can be found with searchByKeyword.
 * @param id the id of the manga.
 * @param  options Options for getting the information
 */
// * @param {string} baseURL
async function getByID(id, options = { baseURL: "https://bato.to" }) {
    const baseURL = options.baseURL || "https://bato.to";
    try {
        const document = await (0, utils_1.fetchHTML)(`${baseURL}/title/${id}`);
        if (document == null) {
            return { valid: false, url: `${baseURL}/title/${id}` };
        }
        let titleOriginal = document.querySelector("#app-wrapper > main > div.flex.flex-col.md\\:flex-row > div.flex > div.grow.pl-3.space-y-2.md\\:hidden > h3 > a");
        if (titleOriginal == null) {
            return { valid: false, url: `${baseURL}/title/${id}` };
        }
        titleOriginal = document.querySelector("#app-wrapper > main > div.flex.flex-col.md\\:flex-row > div.flex > div.grow.pl-3.space-y-2.md\\:hidden > h3 > a").innerHTML;
        const poster = document.querySelector("#app-wrapper > main > div.flex.flex-col.md\\:flex-row > div.flex > div.w-24.md\\:w-52.flex-none.justify-start.items-start > img").src;
        let synonymsQuery = document.querySelector("#app-wrapper > main > div.flex.flex-col.md\\:flex-row > div.flex > div.grow.pl-3.space-y-2.md\\:hidden > div.mt-1.text-xs.md\\:text-base.opacity-80");
        // .getElementsByTagName("span");
        let synonymsArray = [];
        if (synonymsQuery != null) {
            let synonyms = synonymsQuery.getElementsByTagName("span");
            for (let i = 0; i < synonyms.length; i++) {
                let currentSpan = synonyms.item(i);
                if (currentSpan.innerHTML != " / ")
                    synonymsArray.push(currentSpan.innerHTML);
            }
        }
        let authorsQuerySelector = document.querySelector("#app-wrapper > main > div.flex.flex-col.md\\:flex-row > div.flex > div.grow.pl-3.space-y-2.md\\:hidden > div.mt-2.text-sm.md\\:text-base.opacity-80");
        let authorsArray = [];
        if (authorsQuerySelector != null) {
            let authors = authorsQuerySelector.getElementsByTagName("a");
            for (let i = 0; i < authors.length; i++) {
                let currentA = authors.item(i);
                authorsArray.push(currentA.innerHTML.replace("<!-- -->", ""));
            }
        }
        let genres = document.querySelector("#app-wrapper > main > div.flex.flex-col.md\\:flex-row > div.mt-3.md\\:mt-0.md\\:pl-3.grow.grid.gap-3.grid-cols-1.lg\\:grid-cols-3 > div:nth-child(2) > div.flex.items-center.flex-wrap").getElementsByTagName("span");
        let genresArray = [];
        for (let i = 0; i < genres.length; i++) {
            let currentSpan = genres.item(i);
            if (currentSpan.innerHTML.includes('<span class="">')) {
                genresArray.push(currentSpan.querySelector('[class=""]').innerHTML);
            }
            if (currentSpan.innerHTML.includes('<span class="font-bold">')) {
                genresArray.push(currentSpan.querySelector('[class="font-bold"]').innerHTML);
            }
            if (currentSpan.innerHTML.includes('<span class="font-bold border-b border-b-primary">')) {
                genresArray.push(currentSpan.querySelector('[class="font-bold border-b border-b-primary"]').innerHTML);
            }
            if (currentSpan.innerHTML.includes('<span class="font-bold border-b border-b-warning">')) {
                genresArray.push(currentSpan.querySelector('[class="font-bold border-b border-b-warning"]').innerHTML);
            }
        }
        let chaptersArray = [];
        let chaptersDivs = (0, utils_1.querySelectorAllRegex)(document.querySelector("#app-wrapper > main > div:nth-child(3) > astro-island > div > div:nth-child(2) > div.scrollable-panel.border-base-300\\/50.border.border-r-2.max-h-\\[380px\\].lg\\:max-h-\\[500px\\] > div"), "data-hk", /0-0-\d*-0/);
        for (let i = 0; i < chaptersDivs.length; i++) {
            let currentChapter = chaptersDivs[i];
            // currentChapter.querySelector(
            //   '[class="link-hover link-primary visited:text-accent"]'
            // );
            let chapter = currentChapter
                .getElementsByClassName("link-hover link-primary visited:text-accent")
                .item(0);
            if (chapter != null) {
                chaptersArray.push({
                    name: chapter.innerHTML,
                    id: chapter.href.replace("/title/", ""),
                });
            }
        }
        let description = document.querySelector("#app-wrapper > main > div.flex.flex-col.md\\:flex-row > div.mt-3.md\\:mt-0.md\\:pl-3.grow.grid.gap-3.grid-cols-1.lg\\:grid-cols-3 > div.lg\\:col-span-3 > astro-island > div > div.max-h-28.overflow-y-hidden > astro-slot > div > astro-island:nth-child(1) > div > div > div > div > p");
        if (description != null) {
            description = description.innerHTML;
        }
        else {
            description = "";
        }
        let score = document.querySelector("#app-wrapper > main > div.flex.flex-col.md\\:flex-row > div.mt-3.md\\:mt-0.md\\:pl-3.grow.grid.gap-3.grid-cols-1.lg\\:grid-cols-3 > div.md\\:max-lg\\:grid.md\\:max-lg\\:grid-cols-2.md\\:max-lg\\:gap-3 > div:nth-child(1) > div > div.flex.flex-col.justify-start.items-center > div.leading-\\[2\\.0rem\\].md\\:leading-\\[2\\.5rem\\].border-b.border-base-200\\/60.mb-1 > span").innerHTML
            .replace(/<!-- -->/g, "")
            .replace("&lt;", "<");
        let status = document.getElementsByClassName("font-bold uppercase").item(0).innerHTML;
        let readDirection = (0, utils_1.querySelectorAllRegex)(document, "name", /arrow-\w*/g);
        if (readDirection.length == 0) {
            readDirection = "";
        }
        else {
            switch (readDirection[0].getAttribute("name")) {
                case "arrow-right":
                    readDirection = "Left to Right";
                    break;
                case "arrow-left":
                    readDirection = "Right to Left";
                    break;
                case "arrow-down":
                    readDirection = "Top to Bottom";
                    break;
                default:
                    readDirection = "";
            }
        }
        let mature = false;
        if ((0, utils_1.isMature)(genresArray))
            mature = true;
        return {
            url: `${baseURL}/title/${id}`,
            valid: true,
            title: { original: titleOriginal, synonyms: synonymsArray },
            poster: poster,
            authors: authorsArray,
            genres: genresArray,
            chapters: chaptersArray,
            description: description,
            readDirection: readDirection,
            status: status,
            score: score,
            mature: mature,
        };
    }
    catch (e) {
        console.error(e);
        return { url: `${baseURL}/title/${id}`, valid: false };
    }
}
exports.getByID = getByID;
