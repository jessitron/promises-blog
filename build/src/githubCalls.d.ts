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
export declare function gatherMyRepositoryNames(pageSize?: number): Promise<UsefulRepoData[]>;
export declare function gatherCommitCount(repository: UsefulRepoData): Promise<UsefulRepoData & NumberOfCommits>;
