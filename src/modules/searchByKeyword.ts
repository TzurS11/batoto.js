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
} from "./types";

type options = {
  page?: number;
  baseURL?: sources;
  originalLanguage?: langOriginal[];
  translatedLanguage?: langTransalted[];
  sort?: sortOrder;
  workStatus?: status;
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

    let document = await fetchHTML(uri);
    if (document == null) {
      return {
        url: uri,
        valid: false,
        results: [] as {
          id: string;
          title: { original: string; synonyms: string[] };
          authors: string[];
          poster: string;
          genres: string[];
          mature: boolean;
        }[],
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
      url: uri,
      valid:
        document.querySelector(
          "#app-wrapper > main > div:nth-child(3) > button"
        ) == null,
      results: list,
      pages: numOfPages,
    };
  } catch (e) {
    console.error(e);
    return {
      url: uri,
      valid: false,
      results: [] as {
        id: string;
        title: { original: string; synonyms: string[] };
        authors: string[];
        poster: string;
        genres: string[];
        mature: boolean;
      }[],
      pages: 0,
    };
  }
}
