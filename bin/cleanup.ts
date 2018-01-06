import * as fs from "fs";
import { promisify } from "util";

console.log("Hello");

const config: Promise<DeletionCriteria> = readConfig();

const data: RepoData[] = gatherData();

const recommendationsPromise: Promise<string[]> = constructReport(config, data);

recommendationsPromise.then(recommendations =>
recommendations.forEach(rec =>
    console.log(rec)));


/********************************/


interface DeletionCriteria {
    tooFewCommits: number;
    suspiciousPrefix: string;
}

function readConfig(): Promise<DeletionCriteria> {
    /* {
        tooFewCommits: 1,
        suspiciousPrefix: "test-repo",
    } */
    return promisify(fs.readFile)(
        "config/deletionCriteria.json",
        { encoding: "utf8" })
        .then(configFileContent =>
            JSON.parse(configFileContent));
}

interface RepoData {
    name: string;
    commits: number;
}

function gatherData(): RepoData[] {
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

    return repositoryData;
}

function constructReport(criteriaPromise: Promise<DeletionCriteria>, input: RepoData[]): Promise<string[]> {
    return criteriaPromise.then(criteria => {
        const singleCommitRepos = input.filter(r =>
            (r.commits <= criteria.tooFewCommits) ||
            (r.name.startsWith(criteria.suspiciousPrefix)));
        return singleCommitRepos.map(r => "I recommend deleting " + r.name);
    });
}

