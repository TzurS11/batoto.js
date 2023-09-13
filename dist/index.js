"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPageValid = exports.getHome = exports.searchByKeyword = exports.getRandom = exports.getChapterByID = exports.getByID = void 0;
var getByID_1 = require("./modules/getByID");
Object.defineProperty(exports, "getByID", { enumerable: true, get: function () { return getByID_1.getByID; } });
var getChapterByID_1 = require("./modules/getChapterByID");
Object.defineProperty(exports, "getChapterByID", { enumerable: true, get: function () { return getChapterByID_1.getChapterByID; } });
var getRandom_1 = require("./modules/getRandom");
Object.defineProperty(exports, "getRandom", { enumerable: true, get: function () { return getRandom_1.getRandom; } });
var searchByKeyword_1 = require("./modules/searchByKeyword");
Object.defineProperty(exports, "searchByKeyword", { enumerable: true, get: function () { return searchByKeyword_1.searchByKeyword; } });
var getHome_1 = require("./modules/getHome");
Object.defineProperty(exports, "getHome", { enumerable: true, get: function () { return getHome_1.getHome; } });
var utils_1 = require("./modules/utils");
Object.defineProperty(exports, "isPageValid", { enumerable: true, get: function () { return utils_1.isPageValid; } });
//functions
