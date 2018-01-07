"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stringify = require("json-stringify-safe");
var githubCalls_1 = require("./githubCalls");
githubCalls_1.gatherMyRepositoryNames(2).then(function (result) { return Promise.all(result.map(function (r) { return githubCalls_1.gatherCommitCount(r); })); })
    .then(function (result) {
    return console.log(result.map(function (s) { return stringify(s, null, 2); }).join("\n"));
});
//# sourceMappingURL=exerciseGitHubCalls.js.map