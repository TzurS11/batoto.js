# batoto.js

[![npm version](https://badge.fury.io/js/batoto.js.svg)](https://badge.fury.io/js/batoto.js) [![npm downloads](https://img.shields.io/npm/dw/batoto.js)](https://www.npmjs.com/package/batoto.js) [![GitHub license](https://img.shields.io/github/license/TzurS11/batoto.js)](https://github.com/TzurS11/batoto.js/blob/main/LICENSE)
 [![GitHub stars](https://img.shields.io/github/stars/TzurS11/batoto.js.svg?style=social)](https://github.com/TzurS11/batoto.js) 

Scrape data from bato.to
Download and stream mangas. search by name, author, get information about a manga.

```js
const { getByID, getChapterByID, searchByKeyword } = require("batoto.js");

async function main() {
  //searching by manga name
  let search = await searchByKeyword("jinx", 1);

  //check if there are results.
  if (!search.valid) {
    return console.log("No results found.");
  }

  //top result is index 0
  let topResult = search.results[0];
  console.log("finished searching. Top result: " + topResult.title.original);

  // get information about the search by its id. this includes chapters
  let topManga = await getByID(topResult.id);
  console.log("got manga, all chapters");

  // get list of images from the chapter. this might take a second to load
  let chapter = await getChapterByID(topManga.chapters[0].id);
  console.log(chapter.pages);
}
main();
```

from here you can integrate this into anything you like. An api, a discord bot, and more.

Please report issues in the github repo. this is a web scraping tool for bato.to and not an api so it might happen regularly.
