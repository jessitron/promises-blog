import * as fs from "fs";

console.log("Hello");

const config: DeletionCriteria = readConfig();

const data: RepoData[] = gatherData();

const report: string[] = constructReport(config, data);

makeRecommendations(report);


/********************************/

function makeRecommendations(recommendations: string[]) {
    recommendations.forEach(rec =>
        console.log(rec));
}

interface DeletionCriteria {
    tooFewCommits: number;
    suspiciousPrefix: string;
}

function readConfig(): DeletionCriteria {
    const content = fs.readFileSync(
        "config/deletionCriteria.json",
        { encoding: "utf8" });
    return JSON.parse(content);
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

function constructReport(criteria: DeletionCriteria, input: RepoData[]): string[] {
    const singleCommitRepos = input.filter(r =>
        (r.commits <= criteria.tooFewCommits) ||
        (r.name.startsWith(criteria.suspiciousPrefix)));
    return singleCommitRepos.map(r => "I recommend deleting " + r.name);
}

