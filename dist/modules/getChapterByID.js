"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChapterByID = void 0;
const utils_1 = require("./utils");
/**
 * Get all images from a chapter by id.
 * @param chapterID The id of the chapter. get chapter id from getByID
 * @param options Options for getting the information
 */
async function getChapterByID(chapterID, options = { baseURL: "https://bato.to" }) {
    const baseURL = options.baseURL || "https://bato.to";
    try {
        const document = await (0, utils_1.fetchHTML)(`${baseURL}/title/${chapterID}`);
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
                    pages.push(String(imagesArray[j][1]));
                }
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
