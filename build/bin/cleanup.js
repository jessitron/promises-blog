"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util_1 = require("util");
console.log("Hello");
const config = readConfig();
const data = gatherData();
const report = constructReport(config, data);
makeRecommendations(report);
/********************************/
function makeRecommendations(recommendationsPromise) {
    return recommendationsPromise.then(recommendations => recommendations.forEach(rec => console.log(rec)));
}
function readConfig() {
    /* {
        tooFewCommits: 1,
        suspiciousPrefix: "test-repo",
    } */
    return util_1.promisify(fs.readFile)("config/deletionCriteria.json", { encoding: "utf8" })
        .then(configFileContent => JSON.parse(configFileContent));
}
function gatherData() {
    const repositoryNames = ["test-repo-1", "promises-blog", "abandoned-project", "test-repo-2"];
    function commitCount(repositoryName) {
        return ({
            "test-repo-1": 1,
            "promises-blog": 4,
            "abandoned-project": 1,
            "test-repo-2": 2,
        })[repositoryName];
    }
    const repositoryData = repositoryNames.map(repositoryName => {
        const numberOfCommits = commitCount(repositoryName);
        return {
            name: repositoryName,
            commits: numberOfCommits,
        };
    });
    return Promise.resolve(repositoryData);
}
function constructReport(criteriaPromise, inputPromise) {
    return criteriaPromise.then(criteria => inputPromise
        .then(input => {
        const singleCommitRepos = input.filter(r => (r.commits <= criteria.tooFewCommits) ||
            (r.name.startsWith(criteria.suspiciousPrefix)));
        return singleCommitRepos.map(r => "I recommend deleting " + r.name);
    }));
}
//# sourceMappingURL=cleanup.js.map