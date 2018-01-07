import * as fs from "fs";
import { promisify } from "util";
import { gatherMyRepositoryNames, gatherCommitCount } from "../src/githubCalls";

console.log("Hello");

const config: Promise<DeletionCriteria> = readConfig();

const data: Promise<RepoData[]> = gatherData();

const report: Promise<Report> = constructReport(config, data);

makeRecommendations(report).catch(err => {
    console.log("ERROR: " + err);
});


/********************************/

async function makeRecommendations(reportPromise: Promise<Report>): Promise<void> {
    const finalReport = await reportPromise;

    console.log("Evaluated " + finalReport.repositoriesEvaluated.length + " repositories");

    finalReport.suggestions.forEach(rec =>
        console.log(rec));
}

interface DeletionCriteria {
    tooFewCommits: number;
    suspiciousPrefix: string;
    fork: boolean;
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
    description: string;
    fork: boolean;
}

async function gatherData(): Promise<RepoData[]> {

    const repositories = await gatherMyRepositoryNames();

    const fullData = repositories.map(gatherCommitCount);

    return Promise.all(fullData);
}

interface Report {
    repositoriesEvaluated: RepoData[];
    suggestions: string[];
}

async function constructReport(criteriaPromise: Promise<DeletionCriteria>, inputPromise: Promise<RepoData[]>): Promise<Report> {
    const criteria = await criteriaPromise;
    const input = await inputPromise;

    const summaries = input.map(repo => summarizeRecommendations(repo, evaluateOneRepo(criteria, repo))).filter(s => !!s);
    return { repositoriesEvaluated: input, suggestions: summaries };
}

interface Recommendation {
    shouldDelete: boolean;
    reason: string;
}

function evaluateOneRepo(criteria: DeletionCriteria, r: RepoData): Recommendation[] {
    const recommendations: Recommendation[] = [];

    function deleteBecause(reason: string) {
        recommendations.push({ shouldDelete: true, reason });
    }

    if (r.commits <= criteria.tooFewCommits) {
        deleteBecause("only " + r.commits + " commits");
    }
    if (r.name.startsWith(criteria.suspiciousPrefix)) {
        deleteBecause("name starts with " + criteria.suspiciousPrefix);
    }
    if (criteria.fork && r.fork) {
        deleteBecause("it is a fork");
    }

    return recommendations;
}

function summarizeRecommendations(repo: RepoData, recommendations: Recommendation[]) {
    if (recommendations.filter(r => r.shouldDelete).length > 0) {
        return `Delete ${repo.name} (${repo.description}) because ` + recommendations.map(r => r.reason).join(" and ");
    }
}
