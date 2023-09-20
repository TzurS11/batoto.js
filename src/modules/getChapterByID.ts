import { convertSpecialCharsToUnicode, fetchHTML, isPageValid } from "./utils";
import axios from "axios";
import * as fs from "fs";
import * as archiver from "archiver";
import { axiosProxy, sources } from "./types";
import * as path from "path";

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
          return {
            ...(cacheFile[chapterID] as {
              url: string;
              valid: boolean;
              pages: string[];
            }),
            /**
             * Export all the pages to a zip file. can be used forever since it wont become expired.
             * @param path the path to download the zip to. if not specified: ./downloads/{chapterID}
             */
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
        /**
         * Export all the pages to a zip file. can be used forever since it wont become expired.
         * @param path the path to download the zip to. if not specified: ./downloads/{chapterID}
         */
        downloadZip: async function (
          path = `./downloads/${chapterID.replace(/\//g, "-")}`
        ) {
          console.error("Invalid response. check by seeing if valid is false.");
        },
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
      /**
       * Export all the pages to a zip file. can be used forever since it wont become expired.
       * @param path the path to download the zip to. if not specified: ./downloads/{chapterID}
       */
      downloadZip: async function (
        path = `./downloads/${chapterID.replace(/\//g, "-")}`
      ) {
        if (pages.length == 0)
          return console.error(
            "Invalid response. check by seeing if valid is false."
          );
        return await downloadAndZipImages(pages, path);
      },
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
      /**
       * Export all the pages to a zip file. can be used forever since it wont become expired.
       * @param path the path to download the zip to. if not specified: ./downloads/{chapterID}
       */
      downloadZip: async function (
        path = `./downloads/${chapterID.replace(/\//g, "-")}`
      ) {
        console.error("Invalid response. check by seeing if valid is false.");
      },
    };
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
