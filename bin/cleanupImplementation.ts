
import { promisify } from "util";
import * as fs from "fs";

if (process.argv.length < 2) {
    console.log("ERROR: please pass a file name containing instructions, like the output of cleanupAnalysis");
}

implementCleanup(process.argv[2]);

async function implementCleanup(instructionsFile: string) {

    const content = await promisify(fs.readFile)(instructionsFile, { encoding: "utf8"});

    const deletions = /^Delete (\w+)/mg.exec(content);

    const reposToDelete = deletions.map(match => match[1]);

    console.log("Deleting: " + reposToDelete.join("\n"));
}
