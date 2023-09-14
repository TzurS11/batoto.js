import { convertSpecialCharsToUnicode, fetchHTML, isPageValid } from "./utils";

import * as fs from "fs";
import { axiosProxy, sources } from "./types";

type options = {
  /**
   * incase https://bato.to goes down you can chagne the domain here. lits of mirror links https://rentry.co/batoto/raw
   */
  baseURL?: sources;
  /**
   * converts all special chars so you can handle it as a url.
   */
  unicode?: boolean;
  /**
   * cache the addresses of the images. this takes care of expiration of the images. images that are expired will be replaced with new data.
   */
  cache?: boolean;
  /**
   * Set up a rotating proxy to prevent IP blocking when you have many requests to bato.to
   */
  proxy?: axiosProxy;
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
    proxy: {
      auth: { password: undefined, username: undefined },
      host: undefined,
      port: undefined,
      protocol: undefined,
    },
  }
) {
  const baseURL = options.baseURL || "https://bato.to";
  const unicode = options.unicode || false;
  const cache = options.cache || false;

  try {
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

    const document = await fetchHTML(
      `${baseURL}/title/${chapterID}`,
      options.proxy
    );
    if (document == null) {
      return {
        /**
         * the url used to get the chapter.
         */
        url: `${baseURL}/title/${chapterID}`,
        /**
         * check if the scrape is valid and successful. always check if that is true before using pages
         */
        valid: false,
        /**
         * List of image addresses. if valid is false the array will be empty
         */
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
      /**
       * the url used to get the chapter.
       */
      url: `${baseURL}/title/${chapterID}`,
      /**
       * check if the scrape is valid and successful. always check if that is true before using pages
       */
      valid: pages.length == 0 ? false : true,
      /**
       * List of image addresses. if valid is false the array will be empty
       */
      pages: pages,
    };
  } catch (error) {
    console.error(error);
    return {
      /**
       * the url used to get the chapter.
       */
      url: `${baseURL}/title/${chapterID}`,
      /**
       * check if the scrape is valid and successful. always check if that is true before using pages
       */
      valid: false,
      /**
       * List of image addresses. if valid is false the array will be empty
       */
      pages: [] as string[],
    };
  }
}
