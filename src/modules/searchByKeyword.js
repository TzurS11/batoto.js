const { fetchHTML, querySelectorAllRegex } = require("./utils");

/**
 * Get list of mangas from a keyword. Example: Kimetsu no Yaiba, Demon Slayer
 * @param {string} keyword The text value.
 * @param {number} page If there are too many results to fit in one page you can access another page. Get amount of pages by calling this command with page param set to 1 or dont type anything as the param
 */
async function searchByKeyword(keyword, page = 1) {
  try {
    let document = await fetchHTML(
      `https://bato.to/v3x-search?word=${keyword}&orig=&lang=ja,ko,zh,en&sort=field_follow&page=${page}`
    );
    if (document == null) {
      return { valid: false };
    }
    const matchingElements = querySelectorAllRegex(
      document.querySelector('[data-hk="0-0-2"]'),
      "data-hk",
      /0-0-3-\d*-0/
    );
    const pages = document.querySelector('[data-hk="0-0-4-0-0"]');
    let list = [];
    for (let i = 0; i < matchingElements.length; i++) {
      const poster = querySelectorAllRegex(
        matchingElements[i],
        "data-hk",
        /0-0-3-\d*-1-1-0/
      )[0].src;

      const id = querySelectorAllRegex(
        matchingElements[i],
        "data-hk",
        /0-0-3-\d*-1-1-0/
      )[0].parentElement.href.split("/")[2];

      const titleOriginal = querySelectorAllRegex(
        matchingElements[i],
        "data-hk",
        /0-0-3-\d*-2-2-0/
      )[0]
        .innerHTML.replace(/<span class="highlight-text">/g, "")
        .replace(/<\/span>/g, "");

      const titleSynonyms = querySelectorAllRegex(
        matchingElements[i],
        "data-hk",
        /0-0-3-\d*-3-1-\d*-0/
      );
      let currentSyns = [];
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
      let currentGenres = [];
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
      let currentAuthors = [];
      for (let i = 0; i < authors.length; i++) {
        let currentSpan = authors[i];
        if (currentSpan.innerHTML != " / ")
          currentAuthors.push(
            currentSpan.innerHTML
              .replace(/<span class="highlight-text">/g, "")
              .replace(/<\/span>/g, "")
          );
      }

      let isMature = false;
      if (currentGenres.includes("Mature") || currentGenres.includes("Smut")) isMature = true;

      list.push({
        id: id,
        title: { original: titleOriginal, synonyms: currentSyns },
        authors: currentAuthors,
        poster:
          poster == "/public-assets/img/no-image.png"
            ? "https://bato.to/public-assets/img/no-image.png"
            : String(poster),
        genres: currentGenres,
        mature: isMature,
      });
    }
    let numOfPages = 0;
    if (pages != null) {
      let pageAs = querySelectorAllRegex(pages, "data-hk", /0-0-4-0-1-\d*-2-0/);
      numOfPages = pageAs[pageAs.length - 1].innerHTML;
    }
    return {
      valid:
        document.querySelector(
          "#app-wrapper > main > div:nth-child(3) > button"
        ) == null,
      results: list,
      pages: Number(numOfPages),
    };
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = searchByKeyword;
