import {
  fetchHTML,
  querySelectorAllRegex,
  isMature,
  convertLangArrayToString,
} from "./utils";

import {
  sources,
  langOriginal,
  langTransalted,
  sortOrder,
  status,
  axiosProxy,
} from "./types";

type options = {
  /**
   * Set up a rotating proxy to prevent IP blocking when you have many requests to bato.to
   */
  proxy?: axiosProxy;
  /**
   * if there is more than one page for this search you can change the page here.
   */
  page?: number;
  /**
   * incase https://bato.to goes down you can chagne the domain here. lits of mirror links https://rentry.co/batoto/raw
   */
  baseURL?: sources;
  /**
   * original language of the manga
   */
  originalLanguage?: langOriginal[];
  /**
   * the language the manga is currently in. the translated version
   */
  translatedLanguage?: langTransalted[];
  /**
   * sort results in a different way
   */
  sort?: sortOrder;
  /**
   * the status of the manga not related to bato.to
   */
  workStatus?: status;
  /**
   * the upload status of the manga related to bato.to
   */
  uploadStatus?: status;
};

/**
 * Get list of mangas from a keyword. Example: Kimetsu no Yaiba, Demon Slayer
 * @param keyword The text value.
 * @param options Options for getting the information.
 */
export async function searchByKeyword(
  keyword: string,
  options: options = {
    proxy: {
      auth: { password: undefined, username: undefined },
      host: undefined,
      port: undefined,
      protocol: undefined,
    },
    baseURL: "https://bato.to",
    page: 1,
    originalLanguage: [],
    translatedLanguage: ["ja", "ko", "zh", "en"],
    sort: "field_score",
    workStatus: "" as status,
    uploadStatus: "" as status,
  }
) {
  const baseURL = options.baseURL || "https://bato.to";
  const page = options.page || 1;
  const orig = convertLangArrayToString(options.originalLanguage || []);
  const lang = convertLangArrayToString(
    options.translatedLanguage || ["ja", "ko", "zh", "en"]
  );
  const sort = (options.sort as string) || "field_score";
  const workStatus = (options.workStatus as string) || "";
  const uploadStatus = (options.uploadStatus as string) || "";
  let uri = `${baseURL}/v3x-search?word=${keyword}&orig=${orig}&lang=${lang}&sort=${sort}&page=${page}&status=${workStatus}&upload=${uploadStatus}`;
  try {
    const list: {
      id: string;
      title: { original: string; synonyms: string[] };
      authors: string[];
      poster: string;
      genres: string[];
      mature: boolean;
    }[] = [];

    let document = await fetchHTML(uri, options.proxy);
    if (document == null) {
      return {
        /**
         * the search url.
         */
        url: uri,
        /**
         * check if the search is valid and successful. always check if that is true before using results or pages
         */
        valid: false,
        /**
         * list of mangas found. if valid is false eveything will be empty
         */
        results: [] as {
          id: string;
          title: { original: string; synonyms: string[] };
          authors: string[];
          poster: string;
          genres: string[];
          mature: boolean;
        }[],
        /**
         * how many pages are in this search
         */
        pages: 0,
      };
    }
    const matchingElements = querySelectorAllRegex(
      document.querySelector('[data-hk="0-0-2"]') as Element,
      "data-hk",
      /0-0-3-\d*-0/
    );

    for (let i = 0; i < matchingElements.length; i++) {
      const posterElement = querySelectorAllRegex(
        matchingElements[i],
        "data-hk",
        /0-0-3-\d*-1-1-0/
      )[0] as HTMLImageElement;
      const poster = posterElement.src;

      const id = (posterElement.parentElement as HTMLAnchorElement).href.split(
        "/"
      )[2];

      const titleOriginal = posterElement.title;
      const titleSynonyms = querySelectorAllRegex(
        matchingElements[i],
        "data-hk",
        /0-0-3-\d*-3-1-\d*-0/
      );
      let currentSyns: string[] = [];
      for (let i = 0; i < titleSynonyms.length; i++) {
        let currentSpan = titleSynonyms[i];
        if (currentSpan.innerHTML != " / ")
          currentSyns.push(
            currentSpan.innerHTML
              .replace(/<span class="highlight-text">/g, "")
              .replace(/<\/span>/g, "")
          );
      }

      const genres = querySelectorAllRegex(
        matchingElements[i],
        "data-hk",
        /0-0-3-\d*-6-2-\d*-3-0/
      );
      let currentGenres: string[] = [];
      for (let i = 0; i < genres.length; i++) {
        let currentSpan = genres[i];
        currentGenres.push(
          currentSpan.innerHTML
            .replace(/<span class="highlight-text">/g, "")
            .replace(/<\/span>/g, "")
        );
      }

      const authors = querySelectorAllRegex(
        matchingElements[i],
        "data-hk",
        /0-0-3-\d*-4-1-\d*-0/
      );
      let currentAuthors: string[] = [];
      for (let i = 0; i < authors.length; i++) {
        let currentSpan = authors[i];
        if (currentSpan.innerHTML != " / ")
          currentAuthors.push(
            currentSpan.innerHTML
              .replace(/<span class="highlight-text">/g, "")
              .replace(/<\/span>/g, "")
          );
      }

      let mature = false;
      if (isMature(currentGenres)) mature = true;
      list.push({
        id: id,
        title: { original: titleOriginal, synonyms: currentSyns },
        authors: currentAuthors,
        poster:
          poster == "/public-assets/img/no-image.png"
            ? `${baseURL}/public-assets/img/no-image.png`
            : String(poster),
        genres: currentGenres,
        mature: mature,
      });
    }

    const pages = document.querySelector('[data-hk="0-0-4-0-0"]');

    //0-0-4-0-1-3-2-0
    //0-0-4-0-1-5-2-0
    let numOfPages = 0;
    if (pages != null) {
      let pageAs = querySelectorAllRegex(pages, "data-hk", /0-0-4-0-1-\d*-2-0/);
      numOfPages = Number(pageAs[pageAs.length - 1].innerHTML);
    }
    return {
      /**
       * the search url.
       */
      url: uri,
      /**
       * check if the search is valid and successful. always check if that is true before using results or pages
       */
      valid:
        document.querySelector(
          "#app-wrapper > main > div:nth-child(3) > button"
        ) == null,
      /**
       * list of mangas found. if valid is false eveything will be empty
       */
      results: list,
      /**
       * how many pages are in this search
       */
      pages: numOfPages,
    };
  } catch (e) {
    console.error(e);
    return {
      /**
       * the search url.
       */
      url: uri,
      /**
       * check if the search is valid and successful. always check if that is true before using results or pages
       */
      valid: false,
      /**
       * list of mangas found. if valid is false eveything will be empty
       */
      results: [] as {
        id: string;
        title: { original: string; synonyms: string[] };
        authors: string[];
        poster: string;
        genres: string[];
        mature: boolean;
      }[],
      /**
       * how many pages are in this search
       */
      pages: 0,
    };
  }
}
