<h1 align="center"><img src="https://github.com/TzurS11/batoto.js/assets/90769470/62d35d4b-ed82-4c90-adde-8723ad8e7a62" width="1000"></h1>




<p align="center">
  <a href="https://www.npmjs.com/package/batoto.js" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/batoto.js.svg">
  </a>
  <a href="https://github.com/TzurS11/batoto.js?tab=readme-ov-file#example" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/TzurS11/batoto.js/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/TzurS11/batoto.js/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/TzurS11/batoto.js" />
  </a>
</p>

## Install

```sh
npm install batoto.js
```

## example
Always check if valid property is true. Doesn't matter what you are using this package for.

```js
const { getByID, getChapterByID, searchByKeyword } = require("batoto.js"); //Javascript
//import { getByID, getChapterByID, searchByKeyword } from "batoto.js"; //Typescript

async function getFirstChapter(title) {
  //searching by manga name
  let search = await searchByKeyword(title, 1);

  //check if there are results.
  if (!search.valid) {
    // No results found.
    return [];
  }

  //finished searching. top result is index 0
  let topResult = search.results[0];

  // get information about the search by its id. this includes chapters
  let topManga = await getByID(topResult.id);
  if (!topResult.valid) {
    // "Error getting the manga with the specified id."
    return [];
  }
  // got manga and all chapters

  // get list of images from the chapter. this might take a second to load
  let chapter = await getChapterByID(topManga.chapters[0].id);
  if (!chapter.valid) {
    // Error getting the chapters with the specified chapter ID.
    return [];
  }
  return chapter.pages;
}
// returns empty array if no results were found or there is an error.
// returns string arrray if there are pages for a chapter.
getFirstChapter("Demon Slayer");
```

## Express server
### ✨ [Demo](https://batotojs.tzurs11.repl.co)

```js
const {
  getByID,
  getChapterByID,
  searchByKeyword,
  getRandom,
} = require("batoto.js");
const express = require("express");
const app = express();

app.get("/getRandom", async function (req, res) {
  const random = await getRandom();
  if (random == null) {
    return res.status(404).send({ error: "Couldnt get results." });
  }
  return res.status(200).send(random);
});
// http://localhost:8080/getRandom

app.get("/searchByKeyword/:keyword", async function (req, res) {
  const keyword = req.params.keyword;

  const search = await searchByKeyword(keyword, { page: 1 });
  if (!search.valid) {
    return res.status(404).send({ error: "No results found." });
  }
  return res.status(200).send({ results: search.results, pages: search.pages });
});
// http://localhost:8080/searchByKeyword/demon%20slayer

app.get("/getByID/:id", async function (req, res) {
  const id = req.params.id;

  let manga = await getByID(id);
  if (!manga.valid) {
    return res.status(404).send({ error: "No manga with this id" });
  }
  const chapters = manga.chapters;
  chapters.forEach((x) => {
    x.id = x.id.replace(/\//g, "%2F");
  });
  manga.chapters = chapters;
  // You need to replace the '/' in the chapter id to %2F - this is to prevent endpoint problems with getChapterByID
  return res.status(200).send(manga);
});
// http://localhost:8080/getByID/82182-kimetsu-no-yaiba-official

app.get("/getChapterByID/:id", async function (req, res) {
  const id = req.params.id.replace(/%2F/g, "/");
  // turning %2F back to / because the function expects the id with /

  const chapter = await getChapterByID(id);
  if (!chapter.valid) {
    return res.status(404).send({ error: "Failed to get chapter" });
  }
  return res.status(200).send(chapter);
});
// http://localhost:8080/getChapterByID/82182-kimetsu-no-yaiba-official%2F1582807-ch_1

const PORT = 8080;
app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
```

from here you can integrate this into anything you like. An api, a discord bot, and more.

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2023 [TzurS11](https://github.com/TzurS11).<br />
This project is [MIT](https://github.com/TzurS11/batoto.js/blob/master/LICENSE) licensed.