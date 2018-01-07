import * as fs from "fs";
import { promisify } from "util";

console.log("Hello");

const config: Promise<DeletionCriteria> = readConfig();

const data: Promise<RepoData[]> = gatherData();

const report: Promise<string[]> = constructReport(config, data);

makeRecommendations(report);


/********************************/

function makeRecommendations(recommendationsPromise: Promise<string[]>): Promise<void> {
    return recommendationsPromise.then(recommendations =>
        recommendations.forEach(rec =>
            console.log(rec)));
}

interface DeletionCriteria {
    tooFewCommits: number;
    suspiciousPrefix: string;
}

async function readConfig(): Promise<DeletionCriteria> {
    /* {
        tooFewCommits: 1,
        suspiciousPrefix: "test-repo",
    } */
    const content = await promisify(fs.readFile)(
        "config/deletionCriteria.json",
        { encoding: "utf8" });
    return JSON.parse(content);
}

interface RepoData {
    name: string;
    commits: number;
}

function gatherData(): Promise<RepoData[]> {
    const repositoryNames = ["test-repo-1", "promises-blog", "abandoned-project", "test-repo-2"];

    function commitCount(repositoryName: string): number {
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

function constructReport(criteriaPromise: Promise<DeletionCriteria>, inputPromise: Promise<RepoData[]>): Promise<string[]> {
    return criteriaPromise.then(criteria => inputPromise
        .then(input => {
            const singleCommitRepos = input.filter(r =>
                (r.commits <= criteria.tooFewCommits) ||
                (r.name.startsWith(criteria.suspiciousPrefix)));
            return singleCommitRepos.map(r => "I recommend deleting " + r.name);
        }));
}

