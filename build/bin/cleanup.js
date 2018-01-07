"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var util_1 = require("util");
var githubCalls_1 = require("../src/githubCalls");
console.log("Hello");
var config = readConfig();
var data = gatherData();
var report = constructReport(config, data);
makeRecommendations(report).catch(function (err) {
    console.log("ERROR: " + err);
});
/********************************/
function makeRecommendations(reportPromise) {
    return __awaiter(this, void 0, void 0, function () {
        var finalReport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reportPromise];
                case 1:
                    finalReport = _a.sent();
                    console.log("Evaluated " + finalReport.repositoriesEvaluated.length + " repositories");
                    finalReport.suggestions.forEach(function (rec) {
                        return console.log(rec);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function readConfig() {
    /* {
        tooFewCommits: 1,
        suspiciousPrefix: "test-repo",
    } */
    return util_1.promisify(fs.readFile)("config/deletionCriteria.json", { encoding: "utf8" })
        .then(function (configFileContent) {
        return JSON.parse(configFileContent);
    });
}
function gatherData() {
    return __awaiter(this, void 0, void 0, function () {
        var repositories, fullData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, githubCalls_1.gatherMyRepositoryNames()];
                case 1:
                    repositories = _a.sent();
                    fullData = repositories.map(githubCalls_1.gatherCommitCount);
                    return [2 /*return*/, Promise.all(fullData)];
            }
        });
    });
}
function constructReport(criteriaPromise, inputPromise) {
    return __awaiter(this, void 0, void 0, function () {
        var criteria, input, summaries;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, criteriaPromise];
                case 1:
                    criteria = _a.sent();
                    return [4 /*yield*/, inputPromise];
                case 2:
                    input = _a.sent();
                    summaries = input.map(function (repo) { return summarizeRecommendations(repo, evaluateOneRepo(criteria, repo)); }).filter(function (s) { return !!s; });
                    return [2 /*return*/, { repositoriesEvaluated: input, suggestions: summaries }];
            }
        });
    });
}
function evaluateOneRepo(criteria, r) {
    var recommendations = [];
    function deleteBecause(reason) {
        recommendations.push({ shouldDelete: true, reason: reason });
    }
    if (r.commits <= criteria.tooFewCommits) {
        deleteBecause("only " + r.commits + " commits");
    }
    if (r.name.startsWith(criteria.suspiciousPrefix)) {
        deleteBecause("name starts with " + criteria.suspiciousPrefix);
    }
    return recommendations;
}
function summarizeRecommendations(repo, recommendations) {
    if (recommendations.filter(function (r) { return r.shouldDelete; }).length > 0) {
        return "Delete " + repo.name + " (" + repo.description + ") because " + recommendations.map(function (r) { return r.reason; }).join(" and ");
    }
}
//# sourceMappingURL=cleanup.js.map