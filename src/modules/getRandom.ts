import axios from "axios";
import { isMature } from "./utils";
import { axiosProxy, sources } from "./types";
import {
  GetByIDoptions,
  InvalidMangaInfo,
  MangaInfo,
  getByID,
} from "./getByID";

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

type AdditionalInfoOptions = {};

type Result = {
  id: string;
  title: {
    original: string;
    synonyms: string[];
  };
  authors: string[];
  poster: string;
  genres: string[];
  mature: boolean;
  /**
   * Get more information that is not available just on the random results screen.
   */
  getAdditionalInfo: (
    additionalOptions?: GetByIDoptions
  ) => Promise<MangaInfo | InvalidMangaInfo>;
};

type ValidResult = {
  /**
   * the fetch url
   */
  url: string;
  /**
   * check if the fetch is valid and successful. always check if that is true before using results
   */
  valid: true;
  /**
   * the mangas found.
   */
  results: Result[];
};

type InvalidResult = {
  /**
   * the fetch url
   */
  url: string;
  /**
   * check if the fetch is valid and successful. always check if that is true before using results
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

/**
 * Get random mangas
 * @param options Options for getting the information.
 */
export async function getRandom(
  options: options = {
    baseURL: "https://bato.to",
    proxy: {
      auth: { password: undefined, username: undefined },
      host: undefined,
      port: undefined,
      protocol: undefined,
    },
  }
): Promise<ValidResult | InvalidResult> {
  const baseURL = options.baseURL || "https://bato.to";
  try {
    let requestConfig = {
      proxy:
        options.proxy.host == undefined || options.proxy.port == undefined
          ? undefined
          : options.proxy,
      headers: {
        "Content-Type": "application/json",
        Referer: `${baseURL}/v3x-random`,
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
                id
                dbStatus
                isNormal
                isHidden
                isDeleted
                dateCreate datePublic dateModify
                dateUpload dateUpdate
                name
                slug
                altNames
                authors
                artists
                genres
                origLang tranLang
                uploadStatus
                originalStatus
                originalPubFrom
                originalPubTill
                readDirection
                urlPath
                urlCover600
                urlCover300
                urlCoverOri
                disqusId
                stat_is_hot
                stat_is_new
                stat_count_follows
                stat_count_reviews
                stat_count_post_child
                stat_count_post_reply
                stat_count_mylists
                stat_count_votes
                stat_count_notes
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
                stat_score_avg
                stat_score_bay
                stat_score_val
                stat_count_chapters_normal
                stat_count_chapters_others
              }
              last_chapterNodes(amount: 1) {
                id
                data {
                  id comicId
                  dbStatus
                  isNormal
                  isHidden
                  isDeleted
                  isFinal
                  dateCreate
                  datePublic
                  dateModify
                  volNum
                  chaNum
                  dname
                  title
                  urlPath
                  count_images
                  stat_is_new
                  stat_count_post_child
                  stat_count_post_reply
                  stat_count_views_login
                  stat_count_views_guest
                  userId
                  userNode {
                    id
                    data {
                      id
                      name
                      uniq
                      avatarUrl
                      urlPath
                      dateCreate
                      dateOnline
                      gender
                      birth { y m d }
                      stat_count_comics_normal
                      stat_count_comics_others
                      stat_count_comics_uploaded
                      stat_count_comics_modified
                      stat_count_chapters_normal
                      stat_count_chapters_others
                      stat_count_comment_createds
                      stat_count_comment_receives
                      stat_count_forum_child
                      stat_count_forum_reply
                      stat_count_views_guest
                      stat_count_views_login
                      stat_count_following
                      stat_count_followers
                      stat_warnings_unread
                      stat_warnings_readed
                      count_reviews
                      is_adm is_mod is_vip
                      is_verified is_deleted
                      is_trusted is_muted is_warned is_banned
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
            where: "random",
            chapCount: "1",
            ignoreGlobalPLangs: false,
            ignoreGlobalGenres: false,
            ignoreGlobalBlocks: false,
          },
        },
      },
      requestConfig
    );
    const randomComics = response.data.data.get_content_searchComic.items;
    const list: Result[] = [];
    for (let i = 0; i < randomComics.length; i++) {
      const manga = randomComics[i].data;
      let mature = false;
      const genres = Array.from(manga.genres, String);
      if (isMature(genres)) mature = true;
      const id = String(manga.urlPath).replace("/title/", "");
      list.push({
        id,
        title: {
          original: String(manga.name),
          synonyms: Array.from(manga.altNames, String),
        },
        authors: Array.from(manga.authors, String),
        poster: String(manga.urlCoverOri),
        genres: genres,
        mature: mature,
        getAdditionalInfo: async function (additionalOptions?: GetByIDoptions) {
          return await getByID(
            id,
            Object.assign({}, options, additionalOptions)
          );
        },
      });
    }

    return {
      url: `${baseURL}/apo/`,
      valid: true,
      results: list,
    } as ValidResult;
  } catch (error: any) {
    console.error(error.message);
    return {
      url: `${baseURL}/apo/`,
      valid: false,
    } as InvalidResult;
  }
}
