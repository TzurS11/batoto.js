const { fetchHTML } = require("./utils");

/**
 * Get all images from a chapter by. get chapter id from getByID
 * @param {string} chapterID
 * @param {string} baseURL the base url of the website in case bato.to is not working anymore. get list of compatible websites from here: https://rentry.co/batoto
 */
async function getChapterByID(chapterID, baseURL = "https://bato.to") {
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
      const propsJSON = JSON.parse(astroisland.item(i).getAttribute("props"));
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

module.exports = getChapterByID;
