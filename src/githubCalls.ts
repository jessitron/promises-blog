import axios from "axios";

const GitHubToken = process.env.GITHUB_TOKEN;
if (!GitHubToken) {
    console.log("BEWARE: This won't work without a token");
}
const AuthHeader = { Authorization: "token " + GitHubToken };
const Owner = "jessitron"; // could retrieve this from the github API but it's valid for me to hard-code it

export interface UsefulRepoData {
    commits_url: string;
    fork: boolean;
    watchers: number;
    description: string;
    name: string;
    private: boolean;
}

export interface NumberOfCommits {
    commits: number;
}

export function gatherMyRepositoryNames(pageSize: number = 10): Promise<UsefulRepoData[]> {
    return axios.get("https://api.github.com/users/jessitron/repos?per_page=" + pageSize, { headers: AuthHeader })
        .then(response => response.data as UsefulRepoData[]);
}

export function gatherCommitCount(repository: UsefulRepoData): Promise<UsefulRepoData & NumberOfCommits> {
    const safeCommitsUrl = repository.commits_url.replace("{/sha}", "");
    return axios.get(safeCommitsUrl, { headers: AuthHeader }).then(response => {
        const returnedCommits = response.data;
        return { ...repository, commits: returnedCommits.length };
    }).catch(err => {
        if (err.response && (err.response.status === 409)) {
            console.log("FYI: got 409 retrieving commits for " + repository.name);
            return Promise.resolve({ ...repository, commits: 0 });
        } else {
            return Promise.reject(err);
        }
    });
}

export function actuallyDelete(repoName: string): Promise<void> {
    return axios.delete("https://api.github.com/repos/" + Owner + "/" + repoName, { headers: AuthHeader})
        .then(() => console.log("Deleted " + repoName), err => {
            if (err.response && (err.response.status === 403)) {
                console.log("FYI: you are not authorized to delete " + repoName);
            } else {
                return Promise.reject(err);
            }
        });
}
