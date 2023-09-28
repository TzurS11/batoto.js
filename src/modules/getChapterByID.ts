import { convertSpecialCharsToUnicode, fetchHTML, isPageValid } from "./utils";
import axios from "axios";
import * as fs from "fs";
import * as archiver from "archiver";
import { axiosProxy, sources } from "./types";
import * as path from "path";
import {
  GetByIDoptions,
  MangaInfo,
  InvalidMangaInfo,
  getByID,
} from "./getByID";

export type getChapterByIDoptions = {
  /**
   * incase https://bato.to goes down you can chagne the domain here. lits of mirror links https://rentry.co/batoto/raw
   */
  baseURL?: sources;
  /**
   * converts all special chars so you can handle it as a url.
   * if you need to pass the image in a url then it will cause problems with special chars
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

export type ChapterResult = {
  /**
   * the url used to get the chapter.
   */
  url: string;
  /**
   * check if the scrape is valid and successful. always check if that is true before using pages or downloadZip
   */
  valid: true;
  /**
   * List of image addresses.
   */
  pages: string[];
  /**
   * Export all the pages to a zip file. can be used forever since it wont become expired.
   * @param path the path to download the zip to. if not specified: ./downloads/{chapterID}
   */
  downloadZip: (path?: string) => Promise<void>;
  /**
   * Get more information that is not available just on the chapter page.
   */
  getAdditionalInfo: (
    additionalOptions?: GetByIDoptions
  ) => Promise<MangaInfo | InvalidMangaInfo>;
};

export type InvalidChapterResult = {
  /**
   * the url used to get the chapter.
   */
  url: string;
  /**
   * check if the scrape is valid and successful. always check if that is true before using pages or downloadZip
   */
  valid: false;
  /**
   * ```js
   * THIS MIGHT BE INVALID
   * if (valid == false) return;
   * ```
   */
  pages?: never;
  /**
   * ```js
   * THIS MIGHT BE INVALID
   * if (valid == false) return;
   * ```
   */
  downloadZip?: never;
  /**
   * ```js
   * THIS MIGHT BE INVALID
   * if (valid == false) return;
   * ```
   */
  getAdditionalInfo?: never;
};

/**
 * Get all images from a chapter by id.
 * @param chapterID The id of the chapter. get chapter id from getByID
 * @param options Options for getting the information
 */
export async function getChapterByID(
  chapterID: string,
  options: getChapterByIDoptions = {
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
): Promise<ChapterResult | InvalidChapterResult> {
  const baseURL = options.baseURL || "https://bato.to";
  const unicode = options.unicode || false;
  const cache = options.cache !== undefined ? options.cache : false;

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
          const pages = cacheFile[chapterID].pages as string[];
          return {
            ...(cacheFile[chapterID] as {
              url: string;
              valid: boolean;
              pages: string[];
            }),
            pages: pages.map((x) =>
              unicode == true ? convertSpecialCharsToUnicode(x) : x
            ),
            getAdditionalInfo: async function (
              additionalOptions?: GetByIDoptions
            ) {
              return await getByID(
                chapterID,
                Object.assign({}, options, additionalOptions)
              );
            },
            downloadZip: async function (
              path = `./downloads/${chapterID.replace(/\//g, "-")}`
            ) {
              if (cacheFile[chapterID].pages.length == 0)
                return console.error(
                  "Invalid response. check by seeing if valid is false."
                );
              return await downloadAndZipImages(
                cacheFile[chapterID].pages,
                path
              );
            },
          } as ChapterResult;
        }
      }
    }

    const document = await fetchHTML(
      `${baseURL}/title/${chapterID}`,
      options.proxy
    );
    if (document == null) {
      return {
        url: `${baseURL}/title/${chapterID}`,
        valid: false,
      } as InvalidChapterResult;
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
    if (pages.length > 0) {
      return {
        url: `${baseURL}/title/${chapterID}`,
        valid: true,
        pages: pages,
        getAdditionalInfo: async function (additionalOptions?: GetByIDoptions) {
          return await getByID(
            chapterID,
            Object.assign({}, options, additionalOptions)
          );
        },
        downloadZip: async function (
          path = `./downloads/${chapterID.replace(/\//g, "-")}`
        ) {
          return await downloadAndZipImages(pages, path);
        },
      } as ChapterResult;
    }
    return {
      url: `${baseURL}/title/${chapterID}`,
      valid: false,
    } as InvalidChapterResult;
  } catch (error) {
    console.error(error);
    return {
      url: `${baseURL}/title/${chapterID}`,
      valid: false,
    } as InvalidChapterResult;
  }
}

async function downloadAndZipImages(
  imageUrls: string[],
  outputPath: string
): Promise<void> {
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
        const response = await axios.get(imageUrl, { responseType: "stream" });
        if (response.status === 200) {
          archive.append(response.data, { name: imageName });
        } else {
          console.error(
            `Failed to download ${imageName}: ${response.statusText}`
          );
        }
      } catch (error) {
        console.error(`Error downloading ${imageName}: ${error.message}`);
      }
    }

    archive.finalize();
  });
}
