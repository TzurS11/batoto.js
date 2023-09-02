const { fetchHTML, querySelectorAllRegex } = require("./utils");
const puppeteer = require("puppeteer");
const fs = require("fs");

const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while (checkCounts++ <= maxChecks) {
    let html = await page.content();
    let currentHTMLSize = html.length;

    let bodyHTMLSize = await page.evaluate(
      () => document.body.innerHTML.length
    );

    console.log(
      "last: ",
      lastHTMLSize,
      " <> curr: ",
      currentHTMLSize,
      " body html size: ",
      bodyHTMLSize
    );

    if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
      countStableSizeIterations++;
    else countStableSizeIterations = 0; //reset the counter

    if (countStableSizeIterations >= minStableSizeIterations) {
      console.log("Page rendered fully..");
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitForTimeout(checkDurationMsecs);
  }
};

/**
 * Get all images from a chapter by. get chapter id from getByID
 * @param {string} chapterID
 */
async function getChapterByID(chapterID) {
  //   let document = await fetchHTML(`https://bato.to/title/${chapterID}`);
  //   let imgElements = document.querySelectorAll("[");

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  try {
    // Navigate to the URL
    await page.goto(`https://bato.to/title/${chapterID}?load=2`);
    // Wait for all elements with the specified attribute to exist and become visible
    // await waitTillHTMLRendered(page);
    // Get the inner HTML of all matching elements
    // await page.waitForNetworkIdle();
    // await page.screenshot({ fullPage: true, path: "screenshot.png" });
    let pagesArray = [];
    const elementsWithClassName = await page.$$(
      ".z-10.absolute.top-0.right-0.bottom-0.left-0.w-full.h-full"
    );
    for (const element of elementsWithClassName) {
      const src = await element.evaluate((node) => node.getAttribute("src"));
      pagesArray.push(src);
    }
    await browser.close();
    return {
      pages: pagesArray,
      successful: true,
    };
    // You can further interact with or manipulate the innerHTMLArray as needed
  } catch (error) {
    await browser.close();
    return {
      pages: [],
      successful: false,
    };
  }
  // Close the browser
}

module.exports = getChapterByID;
