import { fetchHTML, querySelectorAllRegex, isMature } from "./utils";
import { axiosProxy, sources } from "./types";

type options = {
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

/**
 * Get more information about a manga based on its id. title, author, poster, genres, chapters, description, read direction, status, score. the id can be found with searchByKeyword.
 * @param id the id of the manga.
 * @param options Options for getting the information
 */
// * @param {string} baseURL
export async function getByID(
  id: string,
  options: options = {
    baseURL: "https://bato.to",
    noChapters: false,
    proxy: {
      auth: { password: undefined, username: undefined },
      host: undefined,
      port: undefined,
      protocol: undefined,
    },
  }
) {
  const baseURL = options.baseURL || "https://bato.to";
  const noChapters = options.noChapters || false;
  try {
    const document = await fetchHTML(`${baseURL}/title/${id}`, options.proxy);
    if (document == null) {
      return {
        /**
         * the url that uas used to scrape
         */
        url: `${baseURL}/title/${id}`,
        /**
         * check if the scrape is valid and successful. always check if that is true before using any of the results
         */
        valid: false,
        /**
         * the id of the manga. if valid is false the array will be empty
         */
        id: "",
        /**
         * the title of the manga. if valid is false the array will be empty
         */
        title: { original: "", synonyms: [] as string[] },
        /**
         * the language of the manga. translated is the language of the manga that was scraped. if valid is false the array will be empty
         */
        languages: { original: "", translated: "" },
        /**
         * the description of the manga. if valid is false the array will be empty
         */
        description: "",
        /**
         * the authors. if valid is false the array will be empty
         */
        authors: [] as string[],
        /**
         * the artists. if valid is false the array will be empty
         */
        artists: [] as string[],
        /**
         * image address of the poster. if valid is false the array will be empty
         */
        poster: "",
        /**
         * the generes of the manga. if valid is false the array will be empty
         */
        genres: "",
        /**
         * the score on bato.to. if valid is false the array will be empty
         */
        score: 0,
        /**
         * the status of the manga. if valid is false the array will be empty
         */
        status: "",
        /**
         * read direction of the manga. left to right, right to left, top to bottom. if valid is false the array will be empty
         */
        readDirection: "",
        /**
         * is the manga 18+. if valid is false the array will be empty
         */
        mature: false,
        /**
         * list of chapters. if disabled in options the array will be empty. if valid is false the array will be empty
         */
        chapters: [] as { name: string; id: string; timestamp: number }[],
      };
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
      case "ltr":
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

    let chaptersArray: { name: string; id: string; timestamp: number }[] = [];
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
          chaptersArray.push({
            name: chapter.innerHTML as string,
            id: (chapter as HTMLAnchorElement).href.replace(
              "/title/",
              ""
            ) as string,
            timestamp: timestamp,
          });
        }
      }
    }

    const languages = {
      original: (data.origLang[1] as string) || "",
      translated: (data.tranLang[1] as string) || "",
    };

    return {
      /**
       * the url that uas used to scrape
       */
      url: `${baseURL}/title/${id}`,
      /**
       * check if the scrape is valid and successful. always check if that is true before using any of the results
       */
      valid: true,
      /**
       * the id of the manga. if valid is false the array will be empty
       */
      id: (mangaID as string) || "",
      /**
       * the title of the manga. if valid is false the array will be empty
       */
      title: title,
      /**
       * the language of the manga. translated is the language of the manga that was scraped. if valid is false the array will be empty
       */
      languages: languages,
      /**
       * the description of the manga. if valid is false the array will be empty
       */
      description: (description as string) || "",
      /**
       * the authors. if valid is false the array will be empty
       */
      authors: authors,
      /**
       * the artists. if valid is false the array will be empty
       */
      artists: artists,
      /**
       * image address of the poster. if valid is false the array will be empty
       */
      poster: (poster as string) || "",
      /**
       * the generes of the manga. if valid is false the array will be empty
       */
      genres: genres,
      /**
       * the score on bato.to. if valid is false the array will be empty
       */
      score: (score as number) || 0,
      /**
       * the status of the manga. if valid is false the array will be empty
       */
      status: (status as string) || "",
      /**
       * read direction of the manga. left to right, right to left, top to bottom. if valid is false the array will be empty
       */
      readDirection: (readDirection as string) || "",
      /**
       * is the manga 18+. if valid is false the array will be empty
       */
      mature: isMature(genres),
      /**
       * list of chapters. if disabled in options the array will be empty. if valid is false the array will be empty
       */
      chapters: chaptersArray,
    };
  } catch (e) {
    console.error(e);
    return {
      /**
       * the url that uas used to scrape
       */
      url: `${baseURL}/title/${id}`,
      /**
       * check if the scrape is valid and successful. always check if that is true before using any of the results
       */
      valid: false,
      /**
       * the id of the manga. if valid is false the array will be empty
       */
      id: "",
      /**
       * the title of the manga. if valid is false the array will be empty
       */
      title: { original: "", synonyms: [] as string[] },
      /**
       * the language of the manga. translated is the language of the manga that was scraped. if valid is false the array will be empty
       */
      languages: { original: "", translated: "" },
      /**
       * the description of the manga. if valid is false the array will be empty
       */
      description: "",
      /**
       * the authors. if valid is false the array will be empty
       */
      authors: [] as string[],
      /**
       * the artists. if valid is false the array will be empty
       */
      artists: [] as string[],
      /**
       * image address of the poster. if valid is false the array will be empty
       */
      poster: "",
      /**
       * the generes of the manga. if valid is false the array will be empty
       */
      genres: "",
      /**
       * the score on bato.to. if valid is false the array will be empty
       */
      score: 0,
      /**
       * the status of the manga. if valid is false the array will be empty
       */
      status: "",
      /**
       * read direction of the manga. left to right, right to left, top to bottom. if valid is false the array will be empty
       */
      readDirection: "",
      /**
       * is the manga 18+. if valid is false the array will be empty
       */
      mature: false,
      /**
       * list of chapters. if disabled in options the array will be empty. if valid is false the array will be empty
       */
      chapters: [] as { name: string; id: string; timestamp: number }[],
    };
  }
}
