import axios from "axios";
import { sources, axiosProxy } from "./types";
import {
  MangaInfo,
  InvalidMangaInfo,
  getByID,
  GetByIDoptions,
} from "./getByID";

type Result = {
  title: string;
  id: string;
  poster: string;
  authors: string[];
  /**
   * Get more information that is not available just on the search screen.
   */
  getAdditionalInfo: (
    additionalOptions?: GetByIDoptions
  ) => Promise<MangaInfo | InvalidMangaInfo>;
};

type ValidSearchBar = {
  /**
   * the fetch url used to get the information.
   */
  url: string;
  /**
   * check if the search is valid and successful. always check if that is true before using results
   */
  valid: true;
  /**
   * results from typing the term. just like typing in the search bar in bato.to.
   */
  results: Result[];
};

type InvalidSearchBar = {
  /**
   * the fetch url used to get the information.
   */
  url: string;
  /**
   * check if the search is valid and successful. always check if that is true before using results
   */
  valid: false;
  /**
   * ```js
   * THIS MIGHT BE INVALID
   * if (valid == false) return;
   * ```
   */
  results?: never;
};

type options = {
  /**
   * incase https://bato.to goes down you can change the domain here. List of mirror links https://rentry.co/batoto/raw
   */
  baseURL?: sources;
  /**
   * Set up a rotating proxy to prevent IP blocking when you have many requests to bato.to
   */
  proxy?: axiosProxy;
};

/**
 * Use this function to get a list of mangas found by the results. This api endpoint might be better when calling a lot of times because it is being used in the original website everytime the user is editing the search term
 * @param term The term used to search the manga.
 * @param options Options for getting the information.
 */
export async function searchBar(
  term: string,
  options: options = {
    baseURL: "https://bato.to",
    proxy: {
      auth: { password: undefined, username: undefined },
      host: undefined,
      port: undefined,
      protocol: undefined,
    },
  }
): Promise<ValidSearchBar | InvalidSearchBar> {
  const baseURL = options.baseURL || "https://bato.to";
  try {
    let requestConfig = {
      proxy:
        options.proxy.host == undefined || options.proxy.port == undefined
          ? undefined
          : options.proxy,
      headers: {
        "Content-Type": "application/json",
        Referer: `${baseURL}/v3x`,
      },
    };
    if (requestConfig.proxy == undefined) delete requestConfig.proxy;
    const response = await axios.post(
      `${baseURL}/apo/`,
      {
        query: `
          query get_content_searchComic($select: SearchComic_Select) {
            get_content_searchComic(select: $select) {
              reqPage reqSize reqSort reqWord
              newPage
              paging {
                total pages page init size skip limit
              }
              items {
                id
                data {
                  id dbStatus isNormal isHidden isDeleted
                  dateCreate datePublic dateModify dateUpload dateUpdate
                  name slug altNames
                  authors artists genres
                  origLang tranLang
                  uploadStatus originalStatus
                  originalPubFrom originalPubTill
                  readDirection
                  urlPath
                  urlCover600 urlCover300 urlCoverOri disqusId
                  stat_is_hot stat_is_new
                  stat_count_follows stat_count_reviews
                  stat_count_post_child stat_count_post_reply
                  stat_count_mylists stat_count_votes stat_count_notes
                  stat_count_emotions {
                    field count
                  }
                  stat_count_statuss {
                    field count
                  }
                  stat_count_scores {
                    field count
                  }
                  stat_count_views {
                    field count
                  }
                  stat_score_avg stat_score_bay stat_score_val
                  stat_count_chapters_normal stat_count_chapters_others
                }
                last_chapterNodes(amount: 1) {
                  id
                  data {
                    id comicId dbStatus isNormal isHidden isDeleted isFinal
                    dateCreate datePublic dateModify
                    volNum chaNum dname title urlPath
                    count_images stat_is_new stat_count_post_child
                    stat_count_post_reply stat_count_views_login stat_count_views_guest
                    userId
                    userNode {
                      id
                      data {
                        id name uniq avatarUrl urlPath
                        dateCreate dateOnline gender birth { y m d }
                        stat_count_comics_normal stat_count_comics_others
                        stat_count_comics_uploaded stat_count_comics_modified
                        stat_count_chapters_normal stat_count_chapters_others
                        stat_count_comment_createds stat_count_comment_receives
                        stat_count_forum_child stat_count_forum_reply
                        stat_count_views_guest stat_count_views_login
                        stat_count_following stat_count_followers
                        stat_warnings_unread stat_warnings_readed
                        count_reviews
                        is_adm is_mod is_vip
                        is_verified is_deleted is_trusted is_muted is_warned is_banned
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          select: {
            page: 1,
            size: 15,
            where: "browse",
            word: term,
          },
        },
        operationName: "get_content_searchComic",
      },
      requestConfig
    );
    let results: Result[] = [];
    const items = response.data.data.get_content_searchComic.items;
    for (let i = 0; i < items.length; i++) {
      const itemData = items[i].data;
      const title = itemData.name as string;
      const id = (itemData.urlPath as string).split("/")[2];
      const poster =
        itemData.urlCoverOri || `${baseURL}/public-assets/img/no-image.png`;
      const authors = itemData.authors as string[];
      results.push({
        title,
        id,
        poster,
        authors,
        getAdditionalInfo: async function (additionalOptions: GetByIDoptions) {
          return await getByID(
            id,
            Object.assign({}, options, additionalOptions)
          );
        },
      });
    }
    return { url: `${baseURL}/apo/`, valid: true, results } as ValidSearchBar;
  } catch (e) {
    console.error(e.message);
    return { url: `${baseURL}/apo/`, valid: false } as InvalidSearchBar;
  }
}
