const { fetchHTML } = require("./utils");

/**
 * Get all images from a chapter by. get chapter id from getByID
 * @param {string} chapterID
 */
async function getChapterByID(chapterID) {
  try {
    const document = await fetchHTML(
      `https://bato.to/title/${chapterID}?load=2`
    );
    const astroisland = document.getElementsByTagName("astro-island");
    const pages = [];
    for (let i = 0; i < astroisland.length; i++) {
      const propsJSON = JSON.parse(astroisland.item(i).getAttribute("props"));
      if (propsJSON.imageFiles) {
        const imagesArray = JSON.parse(propsJSON.imageFiles[1]);
        for (let j = 0; j < imagesArray.length; j++) {
          pages.push(imagesArray[j][1]);
        }
      }
    }
    return { valid: true, pages: pages };
  } catch (error) {
    return { valid: false, pages: [] };
  }
}

module.exports = getChapterByID;
