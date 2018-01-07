

import * as fs from "fs";
import { promisify } from "util";

promiseMe("a visit");

promiseMeFs("your undying love");

promiseMe("your firstborn child");

console.log("End of file");


function promiseMe(something) {
    return new Promise(resolve => {
        console.log(something);
        resolve();
    });
}

function promiseMeFs(something) {
    return promisify(fs.access)(".").then(whatever => {
        console.log(something);
    });
}
