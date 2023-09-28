"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChapterByID = void 0;
const utils_1 = require("./utils");
const axios_1 = require("axios");
const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
const getByID_1 = require("./getByID");
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
    const cache = options.cache !== undefined ? options.cache : false;
    try {
        if (fs.existsSync("./cache/chapters.json")) {
            let cacheFile = JSON.parse(fs.readFileSync("./cache/chapters.json", { encoding: "utf8" }));
            if (cacheFile[chapterID]) {
                if (cacheFile[chapterID].pages[0] != undefined &&
                    (0, utils_1.isPageValid)(cacheFile[chapterID].pages[0])) {
                    const pages = cacheFile[chapterID].pages;
                    return {
                        ...cacheFile[chapterID],
                        pages: pages.map((x) => unicode == true ? (0, utils_1.convertSpecialCharsToUnicode)(x) : x),
                        getAdditionalInfo: async function (additionalOptions) {
                            return await (0, getByID_1.getByID)(chapterID, Object.assign({}, options, additionalOptions));
                        },
                        downloadZip: async function (path = `./downloads/${chapterID.replace(/\//g, "-")}`) {
                            if (cacheFile[chapterID].pages.length == 0)
                                return console.error("Invalid response. check by seeing if valid is false.");
                            return await downloadAndZipImages(cacheFile[chapterID].pages, path);
                        },
                    };
                }
            }
        }
        const document = await (0, utils_1.fetchHTML)(`${baseURL}/title/${chapterID}`, options.proxy);
        if (document == null) {
            return {
                url: `${baseURL}/title/${chapterID}`,
                valid: false,
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
        if (pages.length > 0) {
            return {
                url: `${baseURL}/title/${chapterID}`,
                valid: true,
                pages: pages,
                getAdditionalInfo: async function (additionalOptions) {
                    return await (0, getByID_1.getByID)(chapterID, Object.assign({}, options, additionalOptions));
                },
                downloadZip: async function (path = `./downloads/${chapterID.replace(/\//g, "-")}`) {
                    return await downloadAndZipImages(pages, path);
                },
            };
        }
        return {
            url: `${baseURL}/title/${chapterID}`,
            valid: false,
        };
    }
    catch (error) {
        console.error(error);
        return {
            url: `${baseURL}/title/${chapterID}`,
            valid: false,
        };
    }
}
exports.getChapterByID = getChapterByID;
async function downloadAndZipImages(imageUrls, outputPath) {
    if (!outputPath.endsWith(".zip")) {
        outputPath += ".zip";
    }
    return new Promise(async (resolve, reject) => {
        const outputDirectory = path.dirname(outputPath);
        // Ensure that the output directory exists
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, { recursive: true });
        }
        const output = fs.createWriteStream(outputPath);
        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.pipe(output);
        archive.on("error", (error) => {
            reject(error);
        });
        archive.on("finish", () => {
            resolve();
        });
        for (let i = 0; i < imageUrls.length; i++) {
            const imageUrl = imageUrls[i];
            const imageExtension = path.extname(imageUrl);
            const imageName = `image_${i}${imageExtension.split("?")[0]}`;
            try {
                const response = await axios_1.default.get(imageUrl, { responseType: "stream" });
                if (response.status === 200) {
                    archive.append(response.data, { name: imageName });
                }
                else {
                    console.error(`Failed to download ${imageName}: ${response.statusText}`);
                }
            }
            catch (error) {
                console.error(`Error downloading ${imageName}: ${error.message}`);
            }
        }
        archive.finalize();
    });
}
