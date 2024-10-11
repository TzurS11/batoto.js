// import axios from "axios";
import { getByID, getChapterByID, searchByKeyword } from "..";

async function getFirstChapter(title: string) {
  //searching by manga name
  let search = await searchByKeyword(title);

  //check if there are results.
  if (!search.valid) {
    // No results found.
    return [];
  }

  //finished searching. top result is index 0
  let topResult = search.results[0];

  // get information about the search by its id. this includes chapters
  let topManga = await getByID(topResult.id);
  if (!topManga.valid) {
    // "Error getting the manga with the specified id."
    return [];
  }
  // got manga and all chapters

  // get list of images from the chapter. this might take a second to load
  let chapter = await getChapterByID(topManga.results.chapters[0].id);
  if (!chapter.valid) {
    // Error getting the chapters with the specified chapter ID.
    return [];
  }
  console.log(chapter.pages);
  return chapter.pages;
}
// returns empty array if no results were found or there is an error.
// returns string arrray if there are pages for a chapter.
getFirstChapter("Demon Slayer");
