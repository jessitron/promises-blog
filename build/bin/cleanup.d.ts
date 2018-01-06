declare const data: RepoData[];
declare const config: DeletionCriteria;
declare const recommendations: string[];
/********************************/
interface RepoData {
    name: string;
    commits: number;
}
declare function gatherData(): RepoData[];
declare function constructReport(criteria: any, input: any): any;
interface DeletionCriteria {
    tooFewCommits: number;
    suspiciousPrefix: string;
}
declare function readConfig(): DeletionCriteria;
