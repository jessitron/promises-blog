console.log("Hello");

const data: RepoData[] = gatherData();

const config: DeletionCriteria = readConfig();

const recommendations: string[] = constructReport(config, data);

recommendations.forEach(rec =>
    console.log(rec));


/********************************/

interface RepoData {
    name: string;
    commits: number;
}

function gatherData(): RepoData[] {
    return [
        {
            name: "test-repo-1",
            commits: 1,
        },
        {
            name: "promises-blog",
            commits: 4,
        },
        {
            name: "abandoned-project",
            commits: 1,
        },
        {
            name: "test-repo-2",
            commits: 2,
        }];
}

function constructReport(criteria, input) {
    const singleCommitRepos = input.filter(r =>
        (r.commits <= criteria.tooFewCommits) ||
        (r.name.startsWith(criteria.suspiciousPrefix)));
    return singleCommitRepos.map(r => "I recommend deleting " + r.name);
}

interface DeletionCriteria {
    tooFewCommits: number;
    suspiciousPrefix: string;
}

function readConfig(): DeletionCriteria {
    return {
        tooFewCommits: 1,
        suspiciousPrefix: "test-repo",
    };
}
