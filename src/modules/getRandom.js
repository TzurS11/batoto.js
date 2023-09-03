const fetch = require("node-fetch");
// const { fetchHTML, querySelectorAllRegex } = require("./utils");

/**
 * Get random mangas
 * @returns
 */
async function getRandom() {
  try {
    let randomComics = await fetch("https://bato.to/apo/", {
      headers: {
        "content-type": "application/json",
        Referer: "https://bato.to/v3x-random",
      },
      body: '{"query":"\\n  query get_content_searchComic($select: SearchComic_Select) {\\n    get_content_searchComic(\\n      select: $select\\n    ) {\\n      reqPage reqSize reqSort reqWord\\n      newPage\\n      paging { \\n  total pages page init size skip limit\\n }\\n      items {\\n        id\\n        data {\\n          \\nid\\ndbStatus\\nisNormal\\nisHidden\\nisDeleted\\n\\ndateCreate datePublic dateModify\\ndateUpload dateUpdate\\n\\nname\\nslug\\naltNames\\n\\nauthors\\nartists\\ngenres\\n\\norigLang tranLang\\n\\nuploadStatus\\noriginalStatus\\n\\noriginalPubFrom\\noriginalPubTill\\n\\nreadDirection\\n\\nurlPath\\n\\nurlCover600\\nurlCover300\\nurlCoverOri\\n\\ndisqusId\\n\\n\\n\\nstat_is_hot\\nstat_is_new\\n\\nstat_count_follows\\nstat_count_reviews\\nstat_count_post_child \\nstat_count_post_reply\\n\\nstat_count_mylists\\n\\nstat_count_votes\\nstat_count_notes\\nstat_count_emotions {\\n  field count\\n}\\nstat_count_statuss {\\n  field count\\n}\\nstat_count_scores {\\n  field count\\n}\\nstat_count_views {\\n  field count\\n}\\n\\nstat_score_avg\\nstat_score_bay\\nstat_score_val\\n\\nstat_count_chapters_normal\\nstat_count_chapters_others\\n\\n\\n\\n          \\n        }\\n        \\n        \\n\\n        \\n        \\n\\n        \\n    last_chapterNodes(amount:1) {\\n      \\n  id\\n  data {\\n    \\n\\n  id comicId\\n\\n  dbStatus\\n  isNormal\\n  isHidden\\n  isDeleted\\n  isFinal\\n  \\n  dateCreate\\n  datePublic\\n  dateModify\\n\\n  volNum\\n  chaNum\\n  dname\\n  title\\n  urlPath\\n\\n  count_images\\n\\n  stat_is_new\\n\\n  stat_count_post_child\\n  stat_count_post_reply\\n  stat_count_views_login\\n  stat_count_views_guest\\n  \\n  userId\\n  userNode {\\n    \\n  id \\n  data {\\n    \\nid\\nname\\nuniq\\navatarUrl \\nurlPath\\n\\ndateCreate\\ndateOnline\\n\\ngender \\nbirth{y m d}\\n\\nstat_count_comics_normal\\nstat_count_comics_others\\n\\nstat_count_comics_uploaded\\nstat_count_comics_modified\\n\\nstat_count_chapters_normal\\nstat_count_chapters_others\\n\\nstat_count_comment_createds\\nstat_count_comment_receives\\n\\nstat_count_forum_child\\nstat_count_forum_reply\\n\\nstat_count_views_guest\\nstat_count_views_login\\n\\nstat_count_following\\nstat_count_followers\\n\\nstat_warnings_unread\\nstat_warnings_readed\\n\\ncount_reviews\\n\\nis_adm is_mod is_vip\\nis_verified is_deleted\\nis_trusted is_muted is_warned is_banned\\n\\n  }\\n\\n  }\\n\\n  }\\n\\n    }\\n  \\n\\n        \\n        \\n      }\\n    }\\n  }\\n  ","variables":{"select":{"where":"random","chapCount":"1","ignoreGlobalPLangs":false,"ignoreGlobalGenres":false,"ignoreGlobalBlocks":false}},"operationName":"get_content_searchComic"}',
      method: "POST",
    }).then(async (res) => await res.json());
    let items = randomComics.data.get_content_searchComic.items;
    let list = [];
    for (let i = 0; i < items.length; i++) {
      let manga = items[i].data;

      let isMature = false;
      if (manga.genres.map(String).includes("mature")) isMature = true;
      list.push({
        id: String(manga.urlPath.replace("/title/", "")),
        title: {
          original: String(manga.name),
          synonyms: manga.altNames.map(String),
        },
        authors: manga.authors.map(String),
        poster: String(manga.urlCoverOri),
        genres: manga.genres.map(String),
        mature: isMature,
      });
    }

    return {
      results: list,
      pages: Number(randomComics.data.get_content_searchComic.paging.pages),
    };
  } catch (e) {
    console.log(e.message);
    return null;
  }
}

module.exports = getRandom;
