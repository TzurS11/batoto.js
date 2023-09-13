export type axiosProxy = {
    auth?: {
        password: string;
        username: string;
    };
    host: string;
    port: number;
    protocol?: string;
};
export type sortOrder = "field_score" | "field_follow" | "field_review" | "field_comment" | "field_chapter" | "field_upload" | "field_public" | "field_name";
export type status = "pending" | "ongoing" | "completed" | "hiatus" | "cancelled";
export type sources = "https://bato.to" | "https://wto.to" | "https://mto.to" | "https://dto.to" | "https://hto.to" | "https://batotoo.com" | "https://battwo.com" | "https://batotwo.com" | "https://comiko.net" | "https://mangatoto.com" | "https://mangatoto.net" | "https://mangatoto.org" | "https://comiko.org" | "https://batocomic.com" | "https://batocomic.net" | "https://batocomic.org" | "https://readtoto.com" | "https://readtoto.net" | "https://readtoto.org" | "https://xbato.com" | "https://xbato.net" | "https://xbato.org" | "https://zbato.com" | "https://zbato.net" | "https://zbato.org";
export type langOriginal = "zh" | "en" | "ja" | "ko";
export type langTransalted = "af" | "bg" | "bs" | "hr" | "cs" | "ka" | "fr" | "hi" | "hu" | "kk" | "kn" | "mk" | "mg" | "no" | "ne" | "rm" | "ru" | "th" | "sl" | "sk" | "te" | "vi" | "yo" | "zu" | "_t" | "to" | "es" | "sr" | "ps" | "ml" | "ku" | "ig" | "el" | "nl" | "km" | "am" | "sq" | "my" | "da" | "de" | "is" | "ko" | "ms" | "ny" | "sm" | "so" | "ti" | "tr" | "tk" | "sw" | "es_419" | "sh" | "st" | "pl" | "fa" | "mt" | "mi" | "lo" | "ky" | "id" | "ga" | "gu" | "gn" | "et" | "ceb" | "ca" | "ar" | "en" | "hy" | "az" | "zh" | "fo" | "ht" | "it" | "lv" | "mr" | "pt" | "sn" | "sv" | "uk" | "ur" | "uz" | "ta" | "tg" | "sd" | "si" | "ro" | "pt_br" | "mo" | "mn" | "lb" | "lt" | "ja" | "jv" | "he" | "ha" | "fil" | "fi" | "zh_tw" | "zh_hk" | "bn" | "be";
