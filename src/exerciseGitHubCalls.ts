import * as stringify from "json-stringify-safe";

import { gatherCommitCount, gatherMyRepositoryNames } from "./githubCalls";

gatherMyRepositoryNames(2).then(result => Promise.all(result.map(r => gatherCommitCount(r))))
    .then(result =>
   console.log(result.map(s => stringify(s, null, 2)).join("\n")));

