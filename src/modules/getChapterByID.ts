import { convertSpecialCharsToUnicode, fetchHTML, isPageValid } from "./utils";

import * as fs from "fs";
import { sources } from "./types";

type options = {
  baseURL?: sources;
  unicode?: boolean;
  cache?: boolean;
};

/**
 * Get all images from a chapter by id.
 * @param chapterID The id of the chapter. get chapter id from getByID
 * @param options Options for getting the information
 */
export async function getChapterByID(
  chapterID: string,
  options: options = {
    baseURL: "https://bato.to",
    unicode: false,
    cache: false,
  }
) {
  const baseURL = options.baseURL || "https://bato.to";
  const unicode = options.unicode || false;
  const cache = options.cache || false;

  try {
    if (cache == true) {
      if (fs.existsSync("./cache/chapters.json")) {
        let cacheFile = JSON.parse(
          fs.readFileSync("./cache/chapters.json", { encoding: "utf8" })
        );
        if (cacheFile[chapterID]) {
          if (
            cacheFile[chapterID].pages[0] != undefined &&
            isPageValid(cacheFile[chapterID].pages[0])
          ) {
            return cacheFile[chapterID] as {
              url: string;
              valid: boolean;
              pages: string[];
            };
          }
        }
      }
    }

    const document = await fetchHTML(`${baseURL}/title/${chapterID}`);
    if (document == null) {
      return {
        url: `${baseURL}/title/${chapterID}`,
        valid: false,
        pages: [] as string[],
      };
    }

    const astroisland = document.getElementsByTagName("astro-island");

    const pages: string[] = [];
    for (let i = 0; i < astroisland.length; i++) {
      const propsJSON = JSON.parse(
        (astroisland.item(i) as Element).getAttribute("props") as string
      );
      if (propsJSON.imageFiles) {
        const imagesArray: string[] = JSON.parse(propsJSON.imageFiles[1]);
        for (let j = 0; j < imagesArray.length; j++) {
          let img = imagesArray[j][1];
          if (unicode == true) img = convertSpecialCharsToUnicode(img);
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
      } else {
        let file = JSON.parse(
          fs.readFileSync("./cache/chapters.json", { encoding: "utf8" })
        );
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
  } catch (error) {
    console.error(error);
    return {
      url: `${baseURL}/title/${chapterID}`,
      valid: false,
      pages: [] as string[],
    };
  }
}
