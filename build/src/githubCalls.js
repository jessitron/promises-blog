"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var GitHubToken = process.env.GITHUB_TOKEN;
if (!GitHubToken) {
    console.log("BEWARE: This won't work without a token");
}
var AuthHeader = { Authorization: "token " + GitHubToken };
function gatherMyRepositoryNames(pageSize) {
    if (pageSize === void 0) { pageSize = 10; }
    return axios_1.default.get("https://api.github.com/users/jessitron/repos?per_page=" + pageSize, { headers: AuthHeader })
        .then(function (response) { return response.data; });
}
exports.gatherMyRepositoryNames = gatherMyRepositoryNames;
function gatherCommitCount(repository) {
    var safeCommitsUrl = repository.commits_url.replace("{/sha}", "");
    return axios_1.default.get(safeCommitsUrl, { headers: AuthHeader }).then(function (response) {
        var returnedCommits = response.data;
        return __assign({}, repository, { commits: returnedCommits.length });
    }).catch(function (err) {
        if (err.response && (err.response.status === 409)) {
            console.log("FYI: got 409 retrieving commits for " + repository.name);
            return Promise.resolve(__assign({}, repository, { commits: 0 }));
        }
        else {
            return Promise.reject(err);
        }
    });
}
exports.gatherCommitCount = gatherCommitCount;
//# sourceMappingURL=githubCalls.js.map