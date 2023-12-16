import { fetchHTML, querySelectorAllRegex, isMature } from "./utils";
import { axiosProxy, sources } from "./types";
import {
  ChapterResult,
  InvalidChapterResult,
  getChapterByID,
  getChapterByIDoptions,
} from "./getChapterByID";

export type GetByIDoptions = {
  /**
   * incase https://bato.to goes down you can chagne the domain here. lits of mirror links https://rentry.co/batoto/raw
   */
  baseURL?: sources;
  /**
   * does not retrive chapters. can speed up return time.
   */
  noChapters?: boolean;
  /**
   * Set up a rotating proxy to prevent IP blocking when you have many requests to bato.to
   */
  proxy?: axiosProxy;
};

type batoArray = [number, string][];
function arrayFixer(arr: batoArray): string[] {
  let fixedArray: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    fixedArray.push(arr[i][1] || "");
  }
  return fixedArray;
}

function capitalizeEveryWord(input: string): string {
  // Split the input string into an array of words
  const words = input.split(" ");

  // Capitalize the first letter of each word and join them back together
  const capitalizedWords = words.map((word) => {
    if (word.length > 0) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    } else {
      return "";
    }
  });

  // Join the capitalized words into a single string
  return capitalizedWords.join(" ");
}

type Results = {
  /**
   * the id of the manga.
   */
  id: string;
  /**
   * the title of the manga.
   */
  title: {
    original: string;
    synonyms: string[];
  };
  /**
   * the language of the manga. translated is the language of the manga that was scraped.
   */
  languages: {
    original: string;
    translated: string;
  };
  /**
   * the description of the manga.
   */
  description: string;
  /**
   * the authors.
   */
  authors: string[];
  /**
   * the artists.
   */
  artists: string[];
  /**
   * image address of the poster.
   */
  poster: string;
  /**
   * the generes of the manga.
   */
  genres: string[];
  /**
   * the score on bato.to.
   */
  score: number;
  /**
   * the status of the manga.
   */
  status: string;
  /**
   * read direction of the manga. left to right, right to left, top to bottom.
   */
  readDirection: string;
  /**
   * is the manga 18+.
   */
  mature: boolean;
  /**
   * list of chapters. if disabled in options the array will be empty.
   */
  chapters: {
    name: string;
    id: string;
    timestamp: number;
    /**
     * Get the chapter.
     */
    getChapter: (
      additionalOptions?: getChapterByIDoptions
    ) => Promise<ChapterResult | InvalidChapterResult>;
  }[];
};

export type MangaInfo = {
  /**
   * the url used to get the information.
   */
  url: string;
  /**
   * check if the scrape is valid and successful. always check if that is true before using results.
   */
  valid: true;
  /**
   * The results found with this manga id.
   */
  results: Results;
};

export type InvalidMangaInfo = {
  /**
   * the url used to get the information.
   */
  url: string;
  /**
   * check if the scrape is valid and successful. always check if that is true before using results.
   */
  valid: false;
  /**
   * ```js
   * THIS MIGHT BE INVALID
   * if (valid == false) return;
   * ```
   */
  results?: never;
};

/**
 * Get more information about a manga based on its id. title, author, poster, genres, chapters, description, read direction, status, score. the id can be found with searchByKeyword.
 * @param id the id of the manga.
 * @param options Options for getting the information
 */
// * @param {string} baseURL
export async function getByID(
  id: string,
  options: GetByIDoptions = {
    baseURL: "https://bato.to",
    noChapters: false,
    proxy: {
      auth: { password: undefined, username: undefined },
      host: undefined,
      port: undefined,
      protocol: undefined,
    },
  }
): Promise<MangaInfo | InvalidMangaInfo> {
  const baseURL = options.baseURL || "https://bato.to";
  const noChapters = options.noChapters || false;
  try {
    const document = await fetchHTML(`${baseURL}/title/${id}`, options.proxy);
    if (document == null) {
      return {
        url: `${baseURL}/title/${id}`,
        valid: false,
      } as InvalidMangaInfo;
    }
    let data = JSON.parse(
      document.querySelector('[prefix="r20"]').getAttribute("props")
    ).data[1];
    const mangaID = (data.urlPath[1] as string).split("/")[2];
    const title = {
      original: (data.name[1] as string) || "",
      synonyms: arrayFixer(JSON.parse(data.altNames[1])),
    };
    const authors = arrayFixer(JSON.parse(data.authors[1]));
    const artists = arrayFixer(JSON.parse(data.artists[1]));
    let genres = arrayFixer(JSON.parse(data.genres[1]));
    genres = genres.map((genre) =>
      capitalizeEveryWord(genre.replace(/_/g, " "))
    );
    const status = data.originalStatus[1];
    let readDirection = data.readDirection[1];
    switch (readDirection) {
      case "ltr":
        readDirection = "Left to Right";
        break;
      case "rtl":
        readDirection = "Right to Left";
        break;
      case "ttb":
        readDirection = "Top to Bottom";
        break;
      default:
        readDirection = "";
        break;
    }
    let description = data.summary[1].text[1];
    const poster = data.urlCoverOri[1];
    const score = data.stat_score_avg[1];

    let chaptersArray: {
      name: string;
      id: string;
      timestamp: number;
      /**
       * Get the chapter.
       */
      getChapter: (
        additionalOptions?: getChapterByIDoptions
      ) => Promise<ChapterResult | InvalidChapterResult>;
    }[] = [];
    if (noChapters == false) {
      let chaptersDivs = querySelectorAllRegex(
        document.querySelector(
          "#app-wrapper > main > div:nth-child(3) > astro-island > div > div:nth-child(2) > div.scrollable-panel.border-base-300\\/50.border.border-r-2.max-h-\\[380px\\].lg\\:max-h-\\[500px\\] > div"
        ) as Element,
        "data-hk",
        /0-0-\d*-0/
      );

      for (let i = 0; i < chaptersDivs.length; i++) {
        let currentChapter = chaptersDivs[i];
        let chapter = currentChapter
          .getElementsByClassName("link-hover link-primary visited:text-accent")
          .item(0);
        if (chapter != null) {
          const chapterTime = currentChapter
            .getElementsByTagName("time")
            .item(0)
            .getAttribute("time");
          const timestamp = new Date(chapterTime).getTime();
          const id = (chapter as HTMLAnchorElement).href.replace(
            "/title/",
            ""
          ) as string;
          chaptersArray.push({
            name: chapter.innerHTML as string,
            id,
            timestamp: timestamp,
            getChapter: async function (
              additionalOptions?: getChapterByIDoptions
            ) {
              return await getChapterByID(
                id,
                Object.assign({}, options, additionalOptions)
              );
            },
          });
        }
      }
    }

    const languages = {
      original: (data.origLang[1] as string) || "",
      translated: (data.tranLang[1] as string) || "",
    };

    return {
      url: `${baseURL}/title/${id}`,
      valid: true,
      results: {
        id: (mangaID as string) || "",
        title: title,
        languages: languages,
        description: (description as string) || "",
        authors: authors,
        artists: artists,
        poster: (poster as string) || "",
        genres: genres,
        score: (score as number) || 0,
        status: (status as string) || "",
        readDirection: (readDirection as string) || "",
        mature: isMature(genres),
        chapters: chaptersArray,
      },
    } as MangaInfo;
  } catch (e) {
    console.error(e);
    return {
      url: `${baseURL}/title/${id}`,
      valid: false,
    } as InvalidMangaInfo;
  }
}
