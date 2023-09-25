# batoto.js

[![npm version](https://badge.fury.io/js/batoto.js.svg)](https://badge.fury.io/js/batoto.js) [![npm downloads](https://img.shields.io/npm/dw/batoto.js)](https://www.npmjs.com/package/batoto.js) [![GitHub license](https://img.shields.io/github/license/TzurS11/batoto.js)](https://github.com/TzurS11/batoto.js/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/TzurS11/batoto.js.svg?style=social)](https://github.com/TzurS11/batoto.js)

Scrape data from bato.to
Download and stream mangas. search by name, author, get information about a manga.

## DISCLAMER

Please be aware that the use of this web scraping tool to extract data from the bato.to website **may potentially violate the website's Terms of Service**. I do not endorse or encourage activities that breach the TOS of any website.

Before using this tool, it is your responsibility to review and comply with bato.to's Terms of Service, which may prohibit or restrict web scraping activities. If you choose to proceed with web scraping using this tool, you do so **at your own risk**, and you should be aware of the potential legal and ethical implications.

## Javascript example:
Always check if valid property is true. Doesn't matter what you are using this package for.

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
  if (!topResult.valid) {
    return console.log("Error getting the manga with the specified id.");
  }
  console.log("got manga, all chapters");

  // get list of images from the chapter. this might take a second to load
  let chapter = await getChapterByID(topManga.chapters[0].id);
  if (!chapter.valid) {
    return console.log("Error getting the chapters with the specified chapter ID.");
  }
  console.log(chapter.pages);
}
main();
```

## Express server:

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

### Please report issues in the github repo. this is a web scraping tool for bato.to and not an api so it might happen regularly.
