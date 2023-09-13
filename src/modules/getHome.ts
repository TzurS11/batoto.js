import { fetchHTML, querySelectorAllRegex, isMature } from "./utils";

import { axiosProxy, sources } from "./types";

type options = {
  baseURL?: sources;
  proxy?: axiosProxy;
};
/**
 * get all the the content in the home page.
 * @param options
 * @returns
 */
export async function getHome(
  options: options = {
    baseURL: "https://bato.to",
    proxy: {
      auth: { password: undefined, username: undefined },
      host: undefined,
      port: undefined,
      protocol: undefined,
    },
  }
) {
  const baseURL = options.baseURL || "https://bato.to";
  try {
    let document = await fetchHTML(`${baseURL}/v3x`, options.proxy);
    if (document == null) {
      return {
        url: `${baseURL}/v3x`,
        valid: false,
        popularUpdates: [] as {
          poster: string;
          title: string;
          id: string;
          lastChapter: {
            name: string;
            id: string;
          };
        }[],
        latestReleases: [] as {
          poster: string;
          title: string;
          id: string;
          genres: string[];
          mature: boolean;
          lastChapter: {
            name: string;
            id: string;
          };
        }[],
      };
    }
    let popularUpdates: {
      poster: string;
      title: string;
      id: string;
      lastChapter: {
        name: string;
        id: string;
      };
    }[] = [];
    let popularUpdatesWrapper = document.querySelector(
      "#app-wrapper > main > div:nth-child(3) > astro-island > div > div:nth-child(2) > astro-slot > div"
    );
    let popularUpdatesDivs = querySelectorAllRegex(
      popularUpdatesWrapper,
      "data-hk",
      /0-0-\d*-0/
    );
    for (let i = 0; i < popularUpdatesDivs.length; i++) {
      const currentDiv = popularUpdatesDivs[i];
      const currentDiv_img = currentDiv.getElementsByTagName("img").item(0);
      if (currentDiv_img == null) continue;
      const parent_currentDiv_img =
        currentDiv_img.parentElement as HTMLAnchorElement;
      let lastChapterAnchor = currentDiv
        .getElementsByClassName(
          "link link-hover text-xs text-white line-clamp-1 visited:text-accent"
        )
        .item(0) as HTMLAnchorElement;
      popularUpdates.push({
        poster: currentDiv_img.src || "",
        title: currentDiv_img.alt || "",
        id: parent_currentDiv_img.href.replace("/title/", "") || "",
        lastChapter: {
          name: lastChapterAnchor.innerHTML,
          id: lastChapterAnchor.href.replace("/title/", "") || "",
        },
      });
    }
    let latestReleases: {
      poster: string;
      title: string;
      id: string;
      genres: string[];
      mature: boolean;
      lastChapter: {
        name: string;
        id: string;
      };
    }[] = [];

    let latestReleasesWrapper = document.querySelector(
      "#app-wrapper > main > div:nth-child(4) > astro-island > div > div.space-y-5 > astro-slot > div"
    );
    let latestReleasesDivs = querySelectorAllRegex(
      latestReleasesWrapper,
      "data-hk",
      /0-0-\d*-0/
    );

    for (let i = 0; i < latestReleasesDivs.length; i++) {
      const currentDiv = latestReleasesDivs[i];
      const currentDiv_img = currentDiv.getElementsByTagName("img").item(0);
      if (currentDiv_img == null) continue;
      const parent_currentDiv_img =
        currentDiv_img.parentElement as HTMLAnchorElement;
      let lastChapterAnchor = currentDiv
        .getElementsByClassName("link-hover link-primary visited:link-accent")
        .item(0) as HTMLAnchorElement;
      let lastChapter: {
        name: string;
        id: string;
      };
      if (lastChapterAnchor == undefined) {
        lastChapter = { id: "", name: "" };
      } else {
        lastChapter = {
          name:
            lastChapterAnchor.getElementsByTagName("span").item(0).innerHTML ||
            "",
          id: lastChapterAnchor.href.replace("/title/", "") || "",
        };
      }

      latestReleases.push({
        poster: currentDiv_img.src || "",
        title: currentDiv_img.alt || "",
        id: parent_currentDiv_img.href.replace("/title/", "") || "",
        mature: true,
        genres: [],
        lastChapter: lastChapter,
      });
    }

    return {
      url: `${baseURL}/v3x`,
      valid: true,
      popularUpdates: popularUpdates,
      latestReleases: latestReleases,
    };
  } catch (error: any) {
    console.error(error);
    return {
      url: `${baseURL}/v3x`,
      valid: false,
      popularUpdates: [] as {
        poster: string;
        title: string;
        id: string;
        lastChapter: {
          name: string;
          id: string;
        };
      }[],
      latestReleases: [] as {
        poster: string;
        title: string;
        id: string;
        genres: string[];
        mature: boolean;
        lastChapter: {
          name: string;
          id: string;
        };
      }[],
    };
  }
}
