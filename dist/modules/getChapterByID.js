"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChapterByID = void 0;
const utils_1 = require("./utils");
const fs = require("fs");
/**
 * Get all images from a chapter by id.
 * @param chapterID The id of the chapter. get chapter id from getByID
 * @param options Options for getting the information
 */
async function getChapterByID(chapterID, options = {
    baseURL: "https://bato.to",
    unicode: false,
    cache: false,
    proxy: {
        auth: { password: undefined, username: undefined },
        host: undefined,
        port: undefined,
        protocol: undefined,
    },
}) {
    const baseURL = options.baseURL || "https://bato.to";
    const unicode = options.unicode || false;
    const cache = options.cache || false;
    try {
        if (cache == true) {
            if (fs.existsSync("./cache/chapters.json")) {
                let cacheFile = JSON.parse(fs.readFileSync("./cache/chapters.json", { encoding: "utf8" }));
                if (cacheFile[chapterID]) {
                    if (cacheFile[chapterID].pages[0] != undefined &&
                        (0, utils_1.isPageValid)(cacheFile[chapterID].pages[0])) {
                        return cacheFile[chapterID];
                    }
                }
            }
        }
        const document = await (0, utils_1.fetchHTML)(`${baseURL}/title/${chapterID}`, options.proxy);
        if (document == null) {
            return {
                url: `${baseURL}/title/${chapterID}`,
                valid: false,
                pages: [],
            };
        }
        const astroisland = document.getElementsByTagName("astro-island");
        const pages = [];
        for (let i = 0; i < astroisland.length; i++) {
            const propsJSON = JSON.parse(astroisland.item(i).getAttribute("props"));
            if (propsJSON.imageFiles) {
                const imagesArray = JSON.parse(propsJSON.imageFiles[1]);
                for (let j = 0; j < imagesArray.length; j++) {
                    let img = imagesArray[j][1];
                    if (unicode == true)
                        img = (0, utils_1.convertSpecialCharsToUnicode)(img);
                    pages.push(img);
                }
            }
        }
        if (cache == true) {
            if (!fs.existsSync("./cache/chapters.json")) {
                fs.mkdirSync("./cache", { recursive: true });
                let file = {};
                file[chapterID] = {
                    url: `${baseURL}/title/${chapterID}`,
                    valid: pages.length == 0 ? false : true,
                    pages: pages,
                };
                fs.writeFileSync("./cache/chapters.json", JSON.stringify(file));
            }
            else {
                let file = JSON.parse(fs.readFileSync("./cache/chapters.json", { encoding: "utf8" }));
                file[chapterID] = {
                    url: `${baseURL}/title/${chapterID}`,
                    valid: pages.length == 0 ? false : true,
                    pages: pages,
                };
                fs.writeFileSync("./cache/chapters.json", JSON.stringify(file));
            }
        }
        return {
            url: `${baseURL}/title/${chapterID}`,
            valid: pages.length == 0 ? false : true,
            pages: pages,
        };
    }
    catch (error) {
        console.error(error);
        return {
            url: `${baseURL}/title/${chapterID}`,
            valid: false,
            pages: [],
        };
    }
}
exports.getChapterByID = getChapterByID;
