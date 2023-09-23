import { getByID } from "./modules/getByID";
import { getChapterByID } from "./modules/getChapterByID";
import { getRandom } from "./modules/getRandom";
import { searchByKeyword } from "./modules/searchByKeyword";
import { getHome } from "./modules/getHome";
import { isPageValid } from "./modules/utils";

export { getByID } from "./modules/getByID";
export { getChapterByID } from "./modules/getChapterByID";
export { getRandom } from "./modules/getRandom";
export { searchByKeyword } from "./modules/searchByKeyword";
export { getHome } from "./modules/getHome";
export { isPageValid } from "./modules/utils";

export default class Bato {
  getByID = getByID;
  getChapterByID = getChapterByID;
  getRandom = getRandom;
  searchByKeyword = searchByKeyword;
  getHome = getHome;
  isPageValid = isPageValid;
}
