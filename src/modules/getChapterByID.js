const puppeteer = require("puppeteer");
/**
 * Get all images from a chapter by. get chapter id from getByID
 * @param {string} chapterID
 */
async function getChapterByID(chapterID) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  try {
    page.on("request", (request) => {
      if (
        ["image", "stylesheet", "fetch", "font", "media"].includes(
          request.resourceType()
        )
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(`https://bato.to/title/${chapterID}?load=2`, {
      waitUntil: "domcontentloaded",
    });

    let imagesSelector =
      ".z-10.absolute.top-0.right-0.bottom-0.left-0.w-full.h-full";

    await page.waitForSelector(imagesSelector);

    let pagesArray = [];

    const elementsWithClassName = await page.$$(imagesSelector);

    for (const element of elementsWithClassName) {
      const src = await element.evaluate((node) => node.getAttribute("src"));
      pagesArray.push(src);
    }

    await browser.close();
    return {
      pages: pagesArray,
      successful: true,
    };
  } catch (error) {
    await browser.close();
    return {
      pages: [],
      successful: false,
    };
  }
}

module.exports = getChapterByID;
