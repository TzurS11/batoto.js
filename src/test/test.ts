// import axios from "axios";
import { getByID, getRandom } from "..";

(async () => {
  let manga = await getByID("81514-solo-leveling-official");
  if (!manga.valid) throw new Error("by id");
  const pages = await manga.results.chapters[0].getChapter();
  console.log(pages.pages);
  let random = await getRandom();
  if (!random.valid) throw new Error("by random");
  const randomDetailed = await random.results[0].getAdditionalInfo();
  if (!randomDetailed.valid) throw new Error("by random detailed");
  const randomChapter = await randomDetailed.results.chapters[0].getChapter();
  if (!randomChapter.valid) throw new Error("by random chapter");
  console.log(randomChapter.pages);
})();
