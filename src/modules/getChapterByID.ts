import { sources, fetchHTML } from "./utils";

type options = {
  baseURL?: sources;
};

/**
 * Get all images from a chapter by id.
 * @param chapterID The id of the chapter. get chapter id from getByID
 * @param options Options for getting the information
 */
export async function getChapterByID(
  chapterID: string,
  options: options = { baseURL: "https://bato.to" }
) {
  const baseURL = options.baseURL || "https://bato.to";
  try {
    const document = await fetchHTML(`${baseURL}/title/${chapterID}`);
    if (document == null) {
      return {
        url: `${baseURL}/title/${chapterID}`,
        valid: false,
        pages: [].map((element) => String(element)),
      };
    }
    const astroisland = document.getElementsByTagName("astro-island");

    const pages = [];
    for (let i = 0; i < astroisland.length; i++) {
      const propsJSON = JSON.parse(
        (astroisland.item(i) as Element).getAttribute("props") as string
      );
      if (propsJSON.imageFiles) {
        const imagesArray = JSON.parse(propsJSON.imageFiles[1]);
        for (let j = 0; j < imagesArray.length; j++) {
          pages.push(String(imagesArray[j][1]));
        }
      }
    }
    return {
      url: `${baseURL}/title/${chapterID}`,
      valid: pages.length == 0 ? false : true,
      pages: pages,
    };
  } catch (error) {
    console.error(error);
    return {
      url: `${baseURL}/title/${chapterID}`,
      valid: false,
      pages: [].map((element) => String(element)),
    };
  }
}
