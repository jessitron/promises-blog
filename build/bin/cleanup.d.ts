declare const data: {
    name: string;
    commits: number;
}[];
declare const criteria: {
    tooFewCommits: number;
    suspiciousPrefix: string;
};
declare const recommendations: any;
/********************************/
declare function gatherData(): {
    name: string;
    commits: number;
}[];
declare function constructReport(criteria: any, input: any): any;
declare function readConfig(): {
    tooFewCommits: number;
    suspiciousPrefix: string;
};
