
import { promisify } from "util";
import * as fs from "fs";
import { actuallyDelete } from "../src/githubCalls";

if (process.argv.length < 3) {
    console.log("ERROR: please pass a file name containing instructions, like the output of cleanupAnalysis");
    process.exit(1);
}

implementCleanup(process.argv[2]).catch(err => {
    console.log("ERROR: " + err);
});

async function implementCleanup(instructionsFile: string) {

    const content = await promisify(fs.readFile)(instructionsFile, { encoding: "utf8"})
        .catch(err => Promise.reject(new Error("Unable to read file " + instructionsFile)));

    const deletions = content.split("\n").map(repoToDelete).filter(s => !!s);

    console.log("Deleting: " + deletions.join("\n"));
    return Promise.all(deletions.map(actuallyDelete));
}

function repoToDelete(line: string) {
    const match = line.match(/^Delete ([\w-_.]+)/);
    return match && match[1];
}
