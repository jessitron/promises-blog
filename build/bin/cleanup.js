"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
console.log("Hello");
const config = readConfig();
const data = gatherData();
const report = constructReport(config, data);
makeRecommendations(report);
/********************************/
function makeRecommendations(recommendations) {
    recommendations.forEach(rec => console.log(rec));
}
function readConfig() {
    /* {
        tooFewCommits: 1,
        suspiciousPrefix: "test-repo",
    } */
    const configFileContent = fs.readFileSync("config/deletionCriteria.json", { encoding: "utf8" });
    return JSON.parse(configFileContent);
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
    return repositoryData;
}
function constructReport(criteria, input) {
    const singleCommitRepos = input.filter(r => (r.commits <= criteria.tooFewCommits) ||
        (r.name.startsWith(criteria.suspiciousPrefix)));
    return singleCommitRepos.map(r => "I recommend deleting " + r.name);
}
//# sourceMappingURL=cleanup.js.map